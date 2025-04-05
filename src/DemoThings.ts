import {Entity, MathUtil, RenderRect} from "lagom-engine";
import {MovingThing} from "./MovingThing.ts";

export class DemoThings extends Entity
{
    constructor()
    {
        super("demo", 0, 0);
    }
    onAdded()
    {
        super.onAdded();

        for (let i = 0; i < 20; i++)
        {
            let e = this.scene.addEntity(new Entity("space junk", MathUtil.randomRange(0, 512), MathUtil.randomRange(512, 1024)));
            e.addComponent(new RenderRect(0, 0, 16, 16, 0xFF1100));
            e.addComponent(new MovingThing());
        }

    }
}