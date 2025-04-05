import {Component, Entity, Key, MathUtil, RenderRect, System, TextDisp} from "lagom-engine";
import {Layers, LD57} from "./LD57.ts";
import {ThingMover} from "./MovingThing.ts";

class Controllable extends Component
{
}

class PlayerPhys extends Component
{
    constructor(public sideVelocity: number = 0)
    {
        super();
    }
}

export class Player extends Entity
{
    constructor()
    {
        super("player", LD57.GAME_WIDTH / 2, (LD57.GAME_HEIGHT / 8), Layers.Player);
    }

    onAdded()
    {
        super.onAdded();
        this.addComponent(new Controllable())
        this.addComponent(new PlayerPhys())
        this.addComponent(new RenderRect(0, 0, 8, 16, 0xFFFFFF))
        this.addComponent(new TextDisp(0, 0, "0"));
        this.scene.addSystem(new PlayerMover());
    }
}

class PlayerMover extends System<[PlayerPhys, Controllable, TextDisp]>
{
    minSpeed = 0.04;
    maxSpeed = 0.5;

    sideInc = 0.03;
    sideDrag = 0.008;
    sideMax = 0.2;

    update(delta: number): void
    {
        this.runOnEntities((entity, phys, _, txt) => {
            if (this.scene.game.keyboard.isKeyDown(Key.KeyA, Key.ArrowLeft))
            {
                phys.sideVelocity -= this.sideInc;
            }
            if (this.scene.game.keyboard.isKeyDown(Key.KeyD, Key.ArrowRight))
            {
                phys.sideVelocity += this.sideInc;
            }

            phys.sideVelocity -= phys.sideVelocity * this.sideDrag * delta;
            phys.sideVelocity = MathUtil.clamp(phys.sideVelocity, -this.sideMax, this.sideMax);
            entity.transform.x += phys.sideVelocity * delta;


            let drag = 0;
            if (this.scene.game.keyboard.isKeyDown(Key.Space, Key.KeyW, Key.ArrowUp))
            {
                drag = 0.001;
            }
            let oldVel = ThingMover.velocity;
            ThingMover.velocity -= ThingMover.velocity * drag * delta;
            ThingMover.velocity += 0.0001 * delta;
            ThingMover.velocity = MathUtil.clamp(ThingMover.velocity, this.minSpeed, this.maxSpeed)

            // Based on the acceleration this frame, move slightly up or down from the middle.
            let accel = ThingMover.velocity - oldVel;
            entity.transform.y += accel * 12 * delta;

            txt.pixiObj.text = `${ThingMover.velocity}`;
        });
    }

    types = [PlayerPhys, Controllable, TextDisp];

}