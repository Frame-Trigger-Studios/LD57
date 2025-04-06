import {tileWidth} from "./tiles.ts";
import {LD57} from "../LD57.ts";


export function getDefaultRow(rowLength: number) {
    const row: number[] = [];

    for (let i = 0; i < rowLength; i++)
    {
        // Blocks on left side
        if (i < 2)
        {
            row[i] = 1;
        }
        // Blocks on right side
        else if (i > (rowLength - 3))
        {
            row[i] = 1;
        }
        // Empty middle
        else
        {
            row[i] = 0;
        }
    }
    return row;
}

interface Structure {
    done: boolean;
    getNextRow() : number[];
}

export class LeftRightPipeStructure implements Structure{
    rightWidth: number;
    rightWidthMax: number;
    rightWidthMin: number = 2;
    increasing: boolean;
    done: boolean;

    NUM_TILE_WIDE = LD57.GAME_WIDTH / tileWidth;

    constructor() {
        const NUM_TILE_WIDE = (LD57.GAME_WIDTH / tileWidth);

        this.rightWidth = this.rightWidthMin;
        this.rightWidthMax = Math.floor(Math.random() * ((NUM_TILE_WIDE / 2) + 2));
        this.increasing = true;
        this.done = false;
    }

    getNextRow() : number[] {
        if (this.increasing) {
            if (this.rightWidth >= this.rightWidthMax) {
                this.increasing = false;
            } else {
                this.rightWidth++;
            }
        } else {
            if (this.rightWidth <= this.rightWidthMin) {
                this.done = true;
            } else {
                this.rightWidth--;
            }
        }

        let tiles = Array(this.NUM_TILE_WIDE)
        for (let i = 0; i < this.rightWidth; i++) {
            tiles[i] = 1;
        }
        tiles = tiles.reverse();

        tiles[0] = 1;
        tiles[1] = 1;
        return tiles;
    }
}

export class RightLeftPipeStructure extends LeftRightPipeStructure {
    getNextRow() : number[] {
        return super.getNextRow().reverse();
    }
}

export class VoidStructure implements Structure {
    done: boolean = false;

    voidHeight = 0;
    voidHeightMax = 25;
    NUM_TILE_WIDE = LD57.GAME_WIDTH / tileWidth;
    getNextRow(): number[] {
        this.voidHeight++;
        if (this.voidHeight >= this.voidHeightMax) {
            this.done = true;
        }

        return getDefaultRow(this.NUM_TILE_WIDE);
    }
}

export function generateStructure(structure: Structure): number[][] {
    const rows: number[][] = [];

    while (!structure.done) {
        rows.push(structure.getNextRow())
    }

    return rows;
}
