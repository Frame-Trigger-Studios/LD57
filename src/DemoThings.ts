import {Entity, Log, MathUtil, TiledMapLoader, Timer} from "lagom-engine";
import {MovingThing} from "./MovingThing.ts";
import {LD57} from "./LD57.ts";
import stuff from "./art/sets/stuff.json";
import {Coin, SolidTile} from "./levelGen/tiles.ts";

export class DemoThings extends Entity
{
    sets: any[] = [];

    constructor()
    {
        super("demo", 0, 0);

        // 47, 48
        const loader: TiledMapLoader = new TiledMapLoader(stuff);

        let currentSet: number[][] = [];

        loader.loadFn("Tile Layer 1", (tileId, x, y) => {
            if (tileId == 48)
            {
                this.sets.push(currentSet);
                return;
            }
            if (tileId !== 0)
            {
                // tiles are 1 indexed in the save so 0 can be nothing
                currentSet.push([tileId - 1, x, y]);
            }
        })
    }

    onAdded()
    {
        super.onAdded();

        this.addComponent(new Timer(1500, null, true)).onTrigger.register(caller => {

            let e = this.scene.addEntity(new Entity("set", 0, LD57.GAME_HEIGHT));
            e.addComponent(new MovingThing());
            const set = this.sets[MathUtil.randomRange(0, this.sets.length)];

            // @ts-ignore
            set.forEach(([tileId, lx, y]) => {
                const x = lx + 24;
                // Each tileid represents a spawnable thing/sprite variant.
                switch (tileId)
                {
                    case 9:
                        e.addChild(new Coin(x,y ));
                    default: {
                        e.addChild(new SolidTile(x, y, tileId));
                    }
                }

            })
        });


    }
}