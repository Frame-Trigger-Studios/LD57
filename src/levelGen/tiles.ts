import {
    AnimatedSpriteController,
    CircleCollider,
    Component,
    Entity,
    GlobalSystem,
    PolyCollider,
    RectCollider,
    RenderCircle,
    RenderRect,
    Sprite,
    System
} from "lagom-engine";
import {Layers, LD57, MainScene} from "../LD57.ts";
import {MovingThing} from "../MovingThing.ts";
import {
    generateStructure,
    getDefaultRow,
    LeftRightPipeStructure,
    RightLeftPipeStructure,
    VoidStructure
} from "./structures.ts";
import {ScoreText} from "../ui/score";
import {Boost, Player} from "../Player";

export const tileWidth = 12;
export const tileHeight = 12;

// export const NUM_TILE_WIDE = LD57.GAME_WIDTH / tileWidth;

export class SolidTile extends Entity {

    constructor(x: number, y: number, readonly tileId: number) {
        super("solidTile", x, y, Layers.BLOCK);
    }

    onAdded() {
        super.onAdded();

        const textureX = this.tileId % 12;
        const textureY = Math.floor(this.tileId / 12);

        this.addComponent(new AnimatedSpriteController(0, [
            {
                id: 0,
                textures: [this.scene.game.getResource("tile").texture(textureX, textureY)]
            }]));

        switch (this.tileId) {
            // Rect
            case 0:
                this.addComponent(new RectCollider(MainScene.physics, {layer: Layers.BLOCK, width: 12, height: 12}))
                break;
            case 1:
                this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[0, 0], [12, 0], [0, 12]]
                }));
                break;
            case 2:
                this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[0, 0], [12, 0], [12, 12]]
                }));
                break;
            case 3:
                this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[0, 0], [0, 12], [12, 12]]
                }));
                break;
            case 4:
                this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[12, 0], [0, 12], [12, 12]]
                }));
                break;
            case 5:
                this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[0, 0], [12, 6], [12, 12], [0, 12]]
                }));
                break;
            case 6:
                this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[0, 6], [12, 12], [0, 12]]
                }));
                break;
            case 7:
                this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[12, 6], [12, 12], [0, 12]]
                }));
                break;
            case 8:
                this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[0, 6], [12, 0], [12, 12], [0, 12]]
                }));
                break;
            case 12:
            case 14:
                this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[12, 0], [12, 12], [8, 12]]
                }));
                break;
            case 13:
            case 15:
                this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[0, 0], [4, 12], [0, 12]]
                }));
                break;
            case 24:
            case 26:
                this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[8, 0], [12, 0], [12, 12], [4, 12]]
                }));
                break;
            case 25:
            case 27:
                this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[0, 0], [4, 0], [8, 12], [0, 12]]
                }));
                break;
            case 18:
            case 28:
                this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[4, 0], [12, 0], [12, 12], [8, 12]]
                }));
                break;
            case 19:
            case 29:
                this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[0, 0], [8, 0], [4, 12], [0, 12]]
                }));
                break;
            case 40:
            case 30:
                this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[8, 0], [12, 0], [12, 12]]
                }));
                break;
            case 41:
            case 31:
                this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[0, 0], [4, 0], [0, 12]]
                }));
                break;
            case 36:
                this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[4, 0], [12, 0], [12, 12], [0, 12]]
                }));
                break;
            case 37:
                this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[0, 0], [8, 0], [12, 12], [0, 12]]
                }));
                break;
            case 16:
                this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[0, 0], [12, 0], [12, 12], [4, 12]]
                }));
                break;
            case 17:
                this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[0, 0], [12, 0], [8, 12], [0, 12]]
                }));
                break;

        }


    }
}

export class Coin extends Entity {

    constructor(x: number, y: number) {
        super("coin", x, y, Layers.COIN);
    }

    onAdded() {
        super.onAdded();
        this.addComponent(new Sprite(this.scene.game.getResource("coin").textureFromIndex(0)));
        this.addComponent(new CircleCollider(MainScene.physics, {layer: Layers.COIN, xOff: 6, yOff: 6, radius: 10}))
            .onTrigger.register((caller, data) => {
            if (data.other.layer == Layers.PLAYER) {
                this.destroy();
                let score: ScoreText[] | undefined = this.getScene().getEntityWithName("scoreboard")?.getComponentsOfType<ScoreText>(ScoreText);
                score?.pop()?.addScore(100);

            }
        })

        if (LD57.DEBUG) {
            this.addComponent(new RenderCircle(6, 6, 10))
        }
    }
}

export class SpeedUpPad extends Entity {

    constructor(x: number, y: number) {
        super("speedUP", x, y, Layers.SPEED_UP);
    }

    onAdded() {
        super.onAdded();
        this.addComponent(new RenderRect(0, 0, 12, 12, 0xde5309));
        this.addComponent(new RectCollider(MainScene.physics, {layer: Layers.SPEED_UP, width: 12, height: 12}))
            .onTrigger.register((caller, data) => {
            if (data.other.layer == Layers.PLAYER) {
                (<Player>data.other.parent).addComponent(new Boost(1));
            }
        })
    }
}

export class SpeedDownPad extends Entity {

    constructor(x: number, y: number) {
        super("speedDOWN", x, y, Layers.SPEED_DOWN);
    }

    onAdded() {
        super.onAdded();
        this.addComponent(new RenderRect(0, 0, 12, 12, 0x00FF00));
        this.addComponent(new RectCollider(MainScene.physics, {layer: Layers.SPEED_DOWN, width: 12, height: 12}))
            .onTrigger.register((caller, data) => {
            if (data.other.layer == Layers.PLAYER) {
                (<Player>data.other.parent).addComponent(new Boost(-1.1));
            }
        })
    }
}

export class EmptyTile extends Entity {

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

class ResetMe extends Component {
}

class ResetBlockPos extends System<[ResetMe]> {
    update(delta: number): void {
        this.runOnEntities((entity, component) => {
            if (entity.transform.y < -LD57.GAME_HEIGHT) {
                entity.transform.y += LD57.GAME_HEIGHT * 2;
            }
        })
    }

    types = [ResetMe];

}

export class SideWalls extends Entity {
    constructor() {
        super("sideWalls", 0, 0, Layers.FOREGROUND);
    }

    onAdded() {
        super.onAdded();

        this.scene.addSystem(new ResetBlockPos());

        const wallColliders = this.scene.addEntity(new Entity("wall_colliders"));
        wallColliders.addComponent(new RectCollider(MainScene.physics, {
            layer: Layers.BLOCK,
            height: LD57.GAME_HEIGHT,
            width: 24
        }));
        wallColliders.addComponent(new RectCollider(MainScene.physics, {
            xOff: LD57.GAME_WIDTH - 24,
            layer: Layers.BLOCK,
            height: LD57.GAME_HEIGHT,
            width: 24
        }));

        if (LD57.DEBUG) {
            wallColliders.addComponent(new RenderRect(0, 0, 24, LD57.GAME_HEIGHT));
            wallColliders.addComponent(new RenderRect(LD57.GAME_WIDTH - 24, 0, 24, LD57.GAME_HEIGHT));
        }

        // Add a strip of them on each side
        // We can cheat the physics
        for (let jj = 0; jj < 2; jj++) {
            const e = this.addChild(new Entity("wall1", 0, jj * LD57.GAME_HEIGHT, Layers.FOREGROUND));
            e.addComponent(new MovingThing());
            e.addComponent(new ResetMe());

            for (let i = 0; i < LD57.GAME_HEIGHT / 12; i++) {

                e.addComponent(new Sprite(this.scene.game.getResource("tile").textureFromIndex(0), {
                    xOffset: 0,
                    yOffset: i * 12
                }));
                e.addComponent(new Sprite(this.scene.game.getResource("tile").textureFromIndex(0), {
                    xOffset: 12,
                    yOffset: i * 12
                }));
                e.addComponent(new Sprite(this.scene.game.getResource("tile").textureFromIndex(0), {
                    xOffset: LD57.GAME_WIDTH - 12,
                    yOffset: i * 12
                }));
                e.addComponent(new Sprite(this.scene.game.getResource("tile").textureFromIndex(0), {
                    xOffset: LD57.GAME_WIDTH - 24,
                    yOffset: i * 12
                }));
            }
        }
    }
}
