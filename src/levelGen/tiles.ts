import {AnimatedSpriteController, Entity, GlobalSystem, Log, MathUtil, RenderRect, Sprite} from "lagom-engine";
import {Layers, LD57} from "../LD57.ts";
import {MovingThing} from "../MovingThing.ts";
import {
    generateStructure,
    getDefaultRow,
    LeftRightPipeStructure,
    RightLeftPipeStructure,
    VoidStructure
} from "./structures.ts";

export const tileWidth = 12;
export const tileHeight = 12;

// export const NUM_TILE_WIDE = LD57.GAME_WIDTH / tileWidth;


export class Tile extends Entity {

}

export class SolidTile extends Tile {

    constructor(x: number, y: number, readonly tileId: number) {
        super("solidTile", x, y, Layers.FOREGROUND);
    }

    onAdded() {
        super.onAdded();

        const textureX = this.tileId % 12;
        const textureY = Math.floor(this.tileId / 12);
        Log.warn(this.tileId, textureX, textureY)
        this.addComponent(new AnimatedSpriteController(0, [
            {
                id: 0,
                textures: [this.scene.game.getResource("tile").texture(textureX, textureY)]
            }]));

    }
}

export class Coin extends Tile {

    constructor(x: number, y: number) {
        super("coin", x, y, Layers.FOREGROUND);
    }

    onAdded() {
        super.onAdded();
        this.addComponent(new Sprite(this.scene.game.getResource("coin").textureFromIndex(0)));
    }
}

export class EmptyTile extends Tile {

    constructor(x: number, y: number) {
        super("emptyTile", x, y, Layers.FOREGROUND);
    }

    onAdded() {
        super.onAdded();
        this.addComponent(new RenderRect(0, 0, 12, 12, null, 0x000000));
    }
}

export class TileRow extends Entity {
    constructor(x: number, y: number) {
        super("tileRow", x, y, Layers.FOREGROUND);
    }

    onAdded() {
        super.onAdded();
        this.addComponent(new MovingThing());
    }

    onRemoved() {
        super.onRemoved();
        TileGenerator.layers -= 1;
    }
}

export class TileGenerator extends GlobalSystem<[]> {
    NUM_TILE_WIDE = LD57.GAME_WIDTH / tileWidth;
    lastRow: Entity | undefined = undefined;
    static layers = 0;

    update(delta: number): void {
        while (TileGenerator.layers < 100) {
            const row_y = this.lastRow !== undefined ? this.lastRow.transform.y : LD57.GAME_HEIGHT + 12;
            let rows = this.rollForStructure();
            this.addRows(rows, row_y);

            TileGenerator.layers += 1;
        }
    }

    addRows(rows: number[][], y: number) {
        let spawn_height = y;
        for (let j = 0; j < rows.length; j++) {
            this.lastRow = this.scene.addEntity(new TileRow(0, spawn_height + 12));
            for (let i = 0; i < rows[j].length; i++) {
                if (rows[j][i] == 1) {
                    this.lastRow.addChild(new SolidTile(i * tileWidth, 0, 0));
                } else {
                    // this.addChild(new EmptyTile(i * tileWidth, 0));
                }
            }
            spawn_height = this.lastRow.transform.y;
        }
    }

    rollForStructure(): number[][] {
        const roll = Math.floor(Math.random() * 10);
        if (roll > 0 && roll <= 2) {
            return generateStructure(new LeftRightPipeStructure());
        } else if (roll > 2 && roll <= 4) {
            return generateStructure(new RightLeftPipeStructure());
        } else if (roll > 4 && roll <= 6) {
            return generateStructure(new VoidStructure());
        }

        return [getDefaultRow(this.NUM_TILE_WIDE)];
    }

    types = [];
}
