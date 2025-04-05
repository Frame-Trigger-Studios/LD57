import {Component, Entity, Key, RenderRect, System} from "lagom-engine";
import {Layers} from "./LD57.ts";

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
        super("player", 256, 256, Layers.Player);
    }

    onAdded()
    {
        super.onAdded();
        this.addComponent(new Controllable())
        this.addComponent(new PlayerPhys())
        this.addComponent(new RenderRect(0, 0, 8, 16, 0xFFFFFF))
        this.scene.addSystem(new PlayerMover());
    }
}

class PlayerMover extends System<[PlayerPhys, Controllable]>
{
    update(delta: number): void
    {
        this.runOnEntities((entity, phys) => {
            if (this.scene.game.keyboard.isKeyDown(Key.KeyA, Key.ArrowLeft)) {
                entity.transform.x -= 0.1 * delta;
            }
            if (this.scene.game.keyboard.isKeyDown(Key.KeyD, Key.ArrowRight)) {
                entity.transform.x += 0.1 * delta;
            }
        });
    }

    types = [PlayerPhys, Controllable];

}