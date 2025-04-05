import {Entity, MathUtil, RenderRect, Timer} from "lagom-engine";
import {MovingThing} from "./MovingThing.ts";
import {LD57} from "./LD57.ts";

export class DemoThings extends Entity
{
    constructor()
    {
        super("demo", 0, 0);
    }

    onAdded()
    {
        super.onAdded();

        this.addComponent(new Timer(500, null, true)).onTrigger.register(caller => {
            for (let i = 0; i < 15; i++)
            {
                let e = this.scene.addEntity(new Entity("space junk", MathUtil.randomRange(0, LD57.GAME_WIDTH), MathUtil.randomRange(LD57.GAME_HEIGHT, LD57.GAME_HEIGHT + LD57.GAME_HEIGHT)));
                e.addComponent(new RenderRect(0, 0, 12, 12, 0xFF1100));
                e.addComponent(new MovingThing());
            }
        });


    }
}