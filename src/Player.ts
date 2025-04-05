import {Component, Entity, Key, MathUtil, RenderRect, System, TextDisp} from "lagom-engine";
import {Layers} from "./LD57.ts";
import {ThingMover} from "./MovingThing.ts";

class Controllable extends Component
{
}

class PlayerPhys extends Component
{
    constructor(public velocity: number = 0)
    {
        super();
    }
}

export class Player extends Entity
{
    constructor()
    {
        super("player", 144, 144, Layers.Player);
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
    update(delta: number): void
    {
        this.runOnEntities((entity, phys, _, txt) => {
            if (this.scene.game.keyboard.isKeyDown(Key.KeyA, Key.ArrowLeft))
            {
                entity.transform.x -= 0.1 * delta;
            }
            if (this.scene.game.keyboard.isKeyDown(Key.KeyD, Key.ArrowRight))
            {
                entity.transform.x += 0.1 * delta;
            }

            let drag = 0;
            if (this.scene.game.keyboard.isKeyDown(Key.Space, Key.KeyW, Key.ArrowUp))
            {
                drag = 0.005;
            }
            ThingMover.velocity -= ThingMover.velocity * drag * delta;
            ThingMover.velocity += 0.0001 * delta;
            ThingMover.velocity = MathUtil.clamp(ThingMover.velocity, this.minSpeed, this.maxSpeed)

            txt.pixiObj.text = ThingMover.velocity;
        });
    }

    types = [PlayerPhys, Controllable, TextDisp];

}