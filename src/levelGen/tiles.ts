import {Component, Entity, Game, GlobalSystem, LagomType, RenderRect, System} from "lagom-engine";
import {Layers, LD57} from "../LD57.ts";

export class Tile extends Entity {

}

export class SolidTile extends Tile {

    constructor(x: number, y: number) {
        super("solidTile", x, y, Layers.FOREGROUND);
    }

    onAdded() {
        super.onAdded();
        this.addComponent(new RenderRect(0, 0, 16, 16, 0xFF0000, 0x000000));
    }
}

export class EmptyTile extends Tile {

    constructor(x: number, y: number) {
        super("emptyTile", x, y, Layers.FOREGROUND);
    }

    onAdded() {
        super.onAdded();
        this.addComponent(new RenderRect(0, 0, 16, 16, null, 0x000000));
    }
}

export class TileRow extends Entity {
    constructor(x: number, y: number) {
        super("tileRow", x, y, Layers.FOREGROUND);
    }

    onAdded() {
        super.onAdded();
        const tileWidth = 16;
        const tileHeight = 16;
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
                this.addChild(new EmptyTile(i * tileWidth, 0));
            }

        }
    }
}

export class TileGenerator extends GlobalSystem {

    lastSpawn: number = 0;

    update(delta: number): void {
        this.lastSpawn += delta;
        if (this.lastSpawn > 1000) {
            this.scene.addEntity(new TileRow(0, 10 + 100));
        }
    }

    types: LagomType<Component>[];

}

