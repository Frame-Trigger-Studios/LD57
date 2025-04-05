import {Entity, GlobalSystem, RenderRect} from "lagom-engine";
import {Layers, LD57} from "../LD57.ts";
import {MovingThing} from "../MovingThing.ts";

export class Tile extends Entity
{

}

export class SolidTile extends Tile
{

    constructor(x: number, y: number)
    {
        super("solidTile", x, y, Layers.FOREGROUND);
    }

    onAdded()
    {
        super.onAdded();
        this.addComponent(new RenderRect(0, 0, 16, 16, 0xFF0000, 0x000000));
    }
}

export class EmptyTile extends Tile
{

    constructor(x: number, y: number)
    {
        super("emptyTile", x, y, Layers.FOREGROUND);
    }

    onAdded()
    {
        super.onAdded();
        this.addComponent(new RenderRect(0, 0, 16, 16, null, 0x000000));
    }
}

export class TileRow extends Entity
{
    constructor(x: number, y: number)
    {
        super("tileRow", x, y, Layers.FOREGROUND);
    }

    onAdded()
    {
        super.onAdded();
        this.addComponent(new MovingThing());

        const tileWidth = 16;
        const tileHeight = 16;
        const rowLength = LD57.GAME_WIDTH / tileWidth;
        for (let i = 0; i < rowLength; i++)
        {
            // Blocks on left side
            if (i < 2)
            {
                this.addChild(new SolidTile(i * tileWidth, 0));
            }
            // Blocks on right side
            else if (i > (rowLength - 3))
            {
                this.addChild(new SolidTile(i * tileWidth, 0));
            }
            // Empty middle
            else
            {
                // this.addChild(new EmptyTile(i * tileWidth, 0));
            }

        }
    }

    onRemoved()
    {
        super.onRemoved();
        TileGenerator.layers -= 1;
    }
}

export class TileGenerator extends GlobalSystem<[]>
{

    lastRow: Entity | undefined = undefined;
    static layers = 0;

    update(delta: number): void
    {
        while (TileGenerator.layers < 100)
        {
            const row = this.lastRow !== undefined ? this.lastRow.transform.y : LD57.GAME_HEIGHT + 16;
            this.lastRow = this.scene.addEntity(new TileRow(0, row + 16));
            TileGenerator.layers += 1;
        }
    }

    types = [];
}

