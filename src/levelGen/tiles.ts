import {
    AnimatedSpriteController,
    Component,
    Entity,
    Game,
    GlobalSystem,
    LagomType,
    RenderRect,
    System
} from "lagom-engine";
import {Layers, LD57} from "../LD57.ts";
import {MovingThing} from "../MovingThing.ts";

export class Tile extends Entity {

}

export class SolidTile extends Tile {

    constructor(x: number, y: number) {
        super("solidTile", x, y, Layers.FOREGROUND);
    }

    onAdded() {
        super.onAdded();
        this.addComponent(new AnimatedSpriteController(0, [
            {
                id: 0,
                textures: [this.scene.game.getResource("tile").texture(0, 0, 12, 12)]
            }]));

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

        const tileWidth = 12;
        const tileHeight = 12;
        const rowLength = LD57.GAME_WIDTH / tileWidth;
        for (let i = 0; i < rowLength; i++) {
            // Blocks on left side
            if (i < 2) {
                this.addChild(new SolidTile(i * tileWidth, 0));
            }
            // Blocks on right side
            else if (i > (rowLength - 3)) {
                this.addChild(new SolidTile(i * tileWidth, 0));
            }
            // Empty middle
            else {
                // this.addChild(new EmptyTile(i * tileWidth, 0));
            }

        }
    }
}

export class TileGenerator extends GlobalSystem {

    lastSpawn: number = 0;

    update(delta: number): void {
        this.lastSpawn += delta;
        if (this.lastSpawn > 25) {
            this.scene.addEntity(new TileRow(0, LD57.GAME_HEIGHT + 100));
            this.lastSpawn = 0;
        }
    }

    types: LagomType<Component>[];

}

