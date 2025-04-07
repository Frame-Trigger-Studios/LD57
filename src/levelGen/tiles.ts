import {
    AnimatedSprite,
    CircleCollider,
    Component,
    Entity,
    MathUtil,
    PolyCollider,
    RectCollider,
    RenderCircle,
    RenderRect,
    Sprite,
    SpriteConfig,
    System
} from "lagom-engine";
import {Layers, LD57, MainScene} from "../LD57.ts";
import {MovingThing, ThingMover} from "../MovingThing.ts";
import {ScoreText} from "../ui/score";
import {Boost, Player, PlayerMover} from "../Player";
import {Texture} from "pixi.js";

export const tileWidth = 12;
export const tileHeight = 12;

export class TileBase extends Entity {
}

export class SolidTile extends TileBase {

    constructor(x: number, y: number, readonly tileId: number, readonly dark: boolean = false) {
        super("solidTile", x, y, dark ? Layers.BACKGROUND : Layers.BLOCK);
    }

    onAdded() {
        super.onAdded();

        const textureX = this.tileId % 12;
        const textureY = Math.floor(this.tileId / 12);

        let sprite: null | Texture;

        if (this.dark) {
            if (this.tileId == 0) {
                sprite = this.scene.game.getResource("bg_sq_tile").texture(MathUtil.randomRange(0, 48), 0);
            } else {
                sprite = this.scene.game.getResource("bg_tile").texture(textureX, textureY);
            }
        } else {
            if (this.tileId == 0) {
                sprite = this.scene.game.getResource("sq_tile").texture(MathUtil.randomRange(0, 48), 0);
            } else {
                sprite = this.scene.game.getResource("tile").texture(textureX, textureY);
            }
        }


        this.addComponent(new Sprite(sprite));

        if (this.dark) {
            return;
        }

        let collider: PolyCollider | undefined = undefined;

        switch (this.tileId) {
            // Rect
            case 0:
                collider = this.addComponent(new RectCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    width: 12,
                    height: 12
                }))
                break;
            case 1:
                collider = this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[0, 0], [12, 0], [0, 12]]
                }));
                break;
            case 2:
                collider = this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[0, 0], [12, 0], [12, 12]]
                }));
                break;
            case 3:
                collider = this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[0, 0], [0, 12], [12, 12]]
                }));
                break;
            case 4:
                collider = this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[12, 0], [0, 12], [12, 12]]
                }));
                break;
            case 5:
                collider = this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[0, 0], [12, 6], [12, 12], [0, 12]]
                }));
                break;
            case 6:
                collider = this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[0, 6], [12, 12], [0, 12]]
                }));
                break;
            case 7:
                collider = this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[12, 6], [12, 12], [0, 12]]
                }));
                break;
            case 8:
                collider = this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[0, 6], [12, 0], [12, 12], [0, 12]]
                }));
                break;
            case 12:
            case 14:
                collider = this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[12, 0], [12, 12], [8, 12]]
                }));
                break;
            case 13:
            case 15:
                collider = this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[0, 0], [4, 12], [0, 12]]
                }));
                break;
            case 24:
            case 26:
                collider = this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[8, 0], [12, 0], [12, 12], [4, 12]]
                }));
                break;
            case 25:
            case 27:
                collider = this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[0, 0], [4, 0], [8, 12], [0, 12]]
                }));
                break;
            case 18:
            case 28:
                collider = this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[4, 0], [12, 0], [12, 12], [8, 12]]
                }));
                break;
            case 19:
            case 29:
                collider = this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[0, 0], [8, 0], [4, 12], [0, 12]]
                }));
                break;
            case 40:
            case 30:
                collider = this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[8, 0], [12, 0], [12, 12]]
                }));
                break;
            case 41:
            case 31:
                collider = this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[0, 0], [4, 0], [0, 12]]
                }));
                break;
            case 36:
                collider = this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[4, 0], [12, 0], [12, 12], [0, 12]]
                }));
                break;
            case 37:
                collider = this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[0, 0], [8, 0], [12, 12], [0, 12]]
                }));
                break;
            case 16:
                collider = this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[0, 0], [12, 0], [12, 12], [4, 12]]
                }));
                break;
            case 17:
                collider = this.addComponent(new PolyCollider(MainScene.physics, {
                    layer: Layers.BLOCK,
                    points: [[0, 0], [12, 0], [8, 12], [0, 12]]
                }));
                break;
        }
    }
}

export class Coin extends TileBase {

    constructor(x: number, y: number) {
        super("coin", x, y, Layers.COIN);
    }

    onAdded() {
        super.onAdded();
        this.addComponent(new AnimatedSprite(this.scene.game.getResource("coin").textureSliceFromSheet(), {
            animationSpeed: 100,
        }))
        this.addComponent(new CircleCollider(MainScene.physics, {layer: Layers.COIN, xOff: 6, yOff: 6, radius: 10}))
            .onTrigger.register((caller, data) => {
            if (data.other.layer == Layers.PLAYER) {
                this.destroy();

                const cGet = this.scene.addEntity(new Entity("coinget", this.transform.x, this.transform.y, Layers.COIN));
                cGet.addComponent(new MovingThing());
                cGet.addComponent(new AnimatedSprite(this.scene.game.getResource("coin_get").textureSliceFromRow(0, 0, 2), {
                    animationSpeed: 30,
                    yOffset: -12,
                    xOffset: -12,
                    animationEndEvent: () => {
                        cGet.destroy();
                    }
                }));


                let score: ScoreText[] | undefined = this.getScene().getEntityWithName("scoreboard")?.getComponentsOfType<ScoreText>(ScoreText);
                const speedPercentage = (ThingMover.velocity - PlayerMover.minSpeed) / (PlayerMover.maxSpeed - PlayerMover.minSpeed);
                score?.pop()?.addScore(100 * (1 + speedPercentage));
                MainScene.sound.playSound("coin", true);
            }
        })

        if (LD57.DEBUG) {
            this.addComponent(new RenderCircle(6, 6, 10))
        }
    }
}

export class SpeedUpPad extends TileBase {

    constructor(x: number, y: number) {
        super("speedUP", x, y, Layers.SPEED_UP);
    }

    onAdded() {
        super.onAdded();
        this.addComponent(new AnimatedSprite(this.scene.game.getResource("speedUp").textureSliceFromSheet(), {
            animationSpeed: 100
        }))
        this.addComponent(new RectCollider(MainScene.physics, {layer: Layers.SPEED_UP, width: 12, height: 12}))
            .onTrigger.register((caller, data) => {
            if (data.other.layer == Layers.PLAYER) {
                (<Player>data.other.parent).addComponent(new Boost(1));
                MainScene.sound.playSound("speedup", false);
            }
        })
    }
}

export class SpeedDownPad extends TileBase {

    constructor(x: number, y: number) {
        super("speedDOWN", x, y, Layers.SPEED_DOWN);
    }

    onAdded() {
        super.onAdded();
        this.addComponent(new AnimatedSprite(this.scene.game.getResource("speedDown").textureSliceFromSheet(), {
            animationSpeed: 100
        }))
        this.addComponent(new RectCollider(MainScene.physics, {layer: Layers.SPEED_DOWN, width: 12, height: 12}))
            .onTrigger.register((caller, data) => {
            if (data.other.layer == Layers.PLAYER) {
                (<Player>data.other.parent).addComponent(new Boost(-1.1));
            }
        })
    }
}

class ResetMe extends Component {
}

class ResetBlockPos extends System<[ResetMe]> {
    update(delta: number): void {
        this.runOnEntities((entity, component) => {
            if (entity.transform.y < -LD57.GAME_HEIGHT) {
                entity.transform.y += LD57.GAME_HEIGHT * 2;
                entity.getComponentsOfType<VariantSprite>(VariantSprite)?.forEach((spr) => {
                    spr.reroll()
                })
            }
        })
    }

    types = [ResetMe];

}

export class SideWalls extends Entity {
    constructor() {
        super("sideWalls", 0, 0, Layers.BLOCK);
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

        const tilset = this.scene.game.getResource("sq_tile");

        // Add a strip of them on each side
        // We can cheat the physics
        for (let jj = 0; jj < 2; jj++) {
            const e = this.addChild(new Entity("wall1", 0, jj * LD57.GAME_HEIGHT, Layers.FOREGROUND));
            e.addComponent(new MovingThing());
            e.addComponent(new ResetMe());

            for (let i = 0; i < LD57.GAME_HEIGHT / 12; i++) {

                e.addComponent(new VariantSprite(tilset.textureSliceFromRow(0, 0, 47), {
                    xOffset: 0,
                    yOffset: i * 12,
                }));
                e.addComponent(new VariantSprite(tilset.textureSliceFromRow(0, 0, 47), {
                    xOffset: 12,
                    yOffset: i * 12,
                }));
                e.addComponent(new VariantSprite(tilset.textureSliceFromRow(0, 0, 47), {
                    xOffset: LD57.GAME_WIDTH - 12,
                    yOffset: i * 12,
                }));
                e.addComponent(new VariantSprite(tilset.textureSliceFromRow(0, 0, 47), {
                    xOffset: LD57.GAME_WIDTH - 24,
                    yOffset: i * 12,
                }));
            }
        }
    }
}


class VariantSprite extends Sprite {
    constructor(readonly textures: Texture[], config: SpriteConfig) {
        super(textures[MathUtil.randomRange(0, textures.length)], config);
    }

    reroll() {
        this.pixiObj.texture = this.textures[MathUtil.randomRange(0, this.textures.length)];
    }
}