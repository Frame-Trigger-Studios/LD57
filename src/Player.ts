import {
    AnimatedSprite,
    AnimatedSpriteController,
    CircleCollider,
    Component,
    Entity,
    Key,
    MathUtil,
    RenderCircle,
    ScreenShake,
    System,
    Timer
} from "lagom-engine";
import {Layers, LD57, MainScene} from "./LD57.ts";
import {MovingThing, ThingMover} from "./MovingThing.ts";

class Controllable extends Component {
}

export class PlayerPhys extends Component {
    constructor(public sideVelocity: number = 0, public lastFrameVel: number = 0) {
        super();
    }
}

class SpinMe extends Component {
    constructor(readonly dir: number) {
        super();
    }

}

export class Player extends Entity {
    constructor() {
        super("player", LD57.GAME_WIDTH / 2, (LD57.GAME_HEIGHT / 8), Layers.PLAYER);
    }

    onAdded() {
        super.onAdded();

        this.addComponent(new AnimatedSpriteController(0, [
            {
                id: 0,
                textures: this.scene.game.getResource("lady_falling").textureSliceFromRow(0, 0, 3),
                config: {xAnchor: 0.5, yAnchor: 0.5, animationSpeed: 120}
            },
            {
                id: 1,
                textures: this.scene.game.getResource("lady_para").textureSliceFromRow(0, 0, 1),
                config: {xAnchor: 0.5, yAnchor: 0.5, animationSpeed: 300}
            },
        ]));

        const phys = this.addComponent(new PlayerPhys())

        this.addComponent(new CircleCollider(MainScene.physics, {layer: Layers.PLAYER, radius: 4, yOff: 16}))
            .onTrigger.register((caller, data) => {
            if (data.other.layer == Layers.BLOCK) {
                if (this.getComponent(SpinMe) != null) {
                    return;
                }

                MainScene.sound.playSound("wallhit", false);
                caller.parent.addComponent(new ScreenShake(0.5, 2000))
                ThingMover.velocity = 0;

                const rotation = MathUtil.randomRange(0, MathUtil.degToRad(360));
                const cGet = this.scene.addEntity(new Entity("wallhit", this.transform.x, this.transform.y, Layers.COIN));
                cGet.addComponent(new MovingThing());
                cGet.addComponent(new AnimatedSprite(this.scene.game.getResource("coin_get").textureSliceFromRow(0, 0, 2), {
                    animationSpeed: 60,
                    yAnchor: 0.5,
                    xAnchor: 0.5,
                    rotation: rotation,
                    animationEndEvent: () => {
                        cGet.destroy();
                    }
                }));
                cGet.addComponent(new AnimatedSprite(this.scene.game.getResource("hit_block").textureSliceFromRow(0, 0, 2), {
                    animationSpeed: 40,
                    yAnchor: 0.5,
                    xAnchor: 0.5,
                    xScale: 1.4,
                    yScale: 1.4,
                    rotation: rotation + MathUtil.degToRad(23),
                    animationEndEvent: () => {
                    }
                }));

                // Disable collisions and spin for 2 seconds.
                const spinner = this.addComponent(new SpinMe(phys.sideVelocity))
                this.addComponent(new Timer(2000, spinner)).onTrigger.register((caller1, data1) => {
                    data1.destroy();
                })
            }
        })
        if (LD57.DEBUG) {
            this.addComponent(new RenderCircle(0, 16, 4));
        }

        this.addComponent(new Controllable())
        this.scene.addSystem(new Booster());
        this.scene.addSystem(new Spinner());
        this.scene.addSystem(new PlayerMover());
        PlayerMover.MAKE_SOUND = false;
    }
}

export class Boost extends Component {
    constructor(readonly mod: number) {
        super();
    }
}

class Booster extends System<[Boost]> {
    update(delta: number): void {
        this.runOnEntities((entity, component) => {
            ThingMover.velocity += 0.005 * component.mod;
            component.destroy();
        })
    }

    types = [Boost];

}

class Spinner extends System<[SpinMe, AnimatedSpriteController]> {
    update(delta: number): void {
        this.runOnEntities((entity, spin, spr) => {

            // @ts-ignore
            spr.applyConfig({rotation: spr.sprite.pixiObj.rotation + Math.sign(spin.dir) * 0.01 * delta})
        })
    }

    types = [SpinMe, AnimatedSpriteController];

}


export class PlayerMover extends System<[PlayerPhys, Controllable, AnimatedSpriteController]> {
    static minSpeed = 0.04;
    static maxSpeed = 0.5;
    static DO_ACCEL = false;
    static MAKE_SOUND = false;

    sideInc = 0.03;
    sideDrag = 0.008;
    sideMax = 0.2;

    acceleration = 0.00002;
    drag = 0.002;

    update(delta: number): void {
        this.runOnEntities((entity, phys, _, spr) => {

            const spinning = entity.getComponent<SpinMe>(SpinMe) !== null;
            if (!spinning) {
                spr.applyConfig({rotation: -phys.sideVelocity})
            }

            if (this.scene.game.keyboard.isKeyDown(Key.KeyA, Key.ArrowLeft)) {
                phys.sideVelocity -= this.sideInc;
            }
            if (this.scene.game.keyboard.isKeyDown(Key.KeyD, Key.ArrowRight)) {
                phys.sideVelocity += this.sideInc;
            }

            phys.sideVelocity -= phys.sideVelocity * this.sideDrag * delta;
            phys.sideVelocity = MathUtil.clamp(phys.sideVelocity, -this.sideMax, this.sideMax);
            entity.transform.x += phys.sideVelocity * delta;

            // Stay in the game window
            entity.transform.x = MathUtil.clamp(entity.transform.x, 12, LD57.GAME_WIDTH - 12);


            let drag = 0;
            if (this.scene.game.keyboard.isKeyDown(Key.Space, Key.KeyW, Key.ArrowUp)) {
                drag = this.drag;
            }


            if (LD57.GAMEOVER) {
                entity.transform.y += 0.06 * delta;
            }

            if (!PlayerMover.DO_ACCEL || LD57.GAMEOVER) {
                spr.setAnimation(1, false);
                entity.transform.x = MathUtil.clamp(entity.transform.x, 30, LD57.GAME_WIDTH - 30);
                return;
            }


            ThingMover.velocity -= ThingMover.velocity * drag * delta;

            // Don't increase speed if we are spinning
            if (!spinning) {
                ThingMover.velocity += this.acceleration * delta;
            }
            ThingMover.velocity = MathUtil.clamp(ThingMover.velocity, PlayerMover.minSpeed, PlayerMover.maxSpeed)

            // Based on the acceleration this frame, move slightly up or down from the middle.
            let frameAccel = ThingMover.velocity - phys.lastFrameVel;
            entity.transform.y += frameAccel * 12 * delta;

            // If we are drifting too much, move back to the bounds
            entity.transform.y = MathUtil.clamp(entity.transform.y, 40, 80);

            phys.lastFrameVel = ThingMover.velocity;

            if (frameAccel < 0 || ThingMover.velocity < 0.042) {
                if (spr.currentState == 0 && PlayerMover.MAKE_SOUND) {
                    MainScene.sound.playSound("slow", false);
                }
                spr.setAnimation(1, false);
            } else {
                spr.setAnimation(0, false);
            }
        });
    }

    types = [PlayerPhys, Controllable, AnimatedSpriteController];

}
