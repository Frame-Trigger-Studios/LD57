import {
    AnimatedSpriteController,
    CircleCollider,
    Component,
    Entity,
    Key,
    MathUtil,
    RenderCircle,
    System
} from "lagom-engine";
import {Layers, LD57, MainScene} from "./LD57.ts";
import {ThingMover} from "./MovingThing.ts";

class Controllable extends Component {
}

class PlayerPhys extends Component {
    constructor(public sideVelocity: number = 0, public lastFrameVel: number = 0) {
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

        this.addComponent(new CircleCollider(MainScene.physics, {layer: Layers.PLAYER, radius: 4, yOff: 16}));
        if (LD57.DEBUG) {
            this.addComponent(new RenderCircle(0, 16, 4));
        }

        this.addComponent(new Controllable())
        this.addComponent(new PlayerPhys())
        this.scene.addSystem(new Booster());
        this.scene.addSystem(new PlayerMover());
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

export class PlayerMover extends System<[PlayerPhys, Controllable, AnimatedSpriteController]> {
    static minSpeed = 0.04;
    static maxSpeed = 0.5;

    sideInc = 0.03;
    sideDrag = 0.008;
    sideMax = 0.2;

    acceleration = 0.00001;
    drag = 0.002;

    update(delta: number): void {
        this.runOnEntities((entity, phys, _, spr) => {
            if (entity.getComponent(Dead) !== null) {
                return;
            }

            spr.applyConfig({rotation: -phys.sideVelocity})

            if (this.scene.game.keyboard.isKeyDown(Key.KeyA, Key.ArrowLeft)) {
                phys.sideVelocity -= this.sideInc;
            }
            if (this.scene.game.keyboard.isKeyDown(Key.KeyD, Key.ArrowRight)) {
                phys.sideVelocity += this.sideInc;
            }

            phys.sideVelocity -= phys.sideVelocity * this.sideDrag * delta;
            phys.sideVelocity = MathUtil.clamp(phys.sideVelocity, -this.sideMax, this.sideMax);
            entity.transform.x += phys.sideVelocity * delta;


            let drag = 0;
            if (this.scene.game.keyboard.isKeyDown(Key.Space, Key.KeyW, Key.ArrowUp)) {
                drag = this.drag;
            }

            ThingMover.velocity -= ThingMover.velocity * drag * delta;
            ThingMover.velocity += this.acceleration * delta;
            ThingMover.velocity = MathUtil.clamp(ThingMover.velocity, PlayerMover.minSpeed, PlayerMover.maxSpeed)

            // Based on the acceleration this frame, move slightly up or down from the middle.
            let frameAccel = ThingMover.velocity - phys.lastFrameVel;
            entity.transform.y += frameAccel * 12 * delta;
            phys.lastFrameVel = ThingMover.velocity;

            if (frameAccel <= 0 || ThingMover.velocity < 0.042) {
                spr.setAnimation(1, false);
            } else {
                spr.setAnimation(0, false);
            }
        });
    }

    types = [PlayerPhys, Controllable, AnimatedSpriteController];

}

export class Dead extends Component {

}
