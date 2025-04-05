import {Component, Entity, Log, MathUtil, System, TiledMapLoader, Timer} from "lagom-engine";
import {MovingThing} from "./MovingThing.ts";
import {LD57} from "./LD57.ts";
import stuff from "./art/sets/stuff.json";
import {Coin, SolidTile} from "./levelGen/tiles.ts";

class SpawnNext extends Component {
    constructor(readonly height: number) {
        super();
    }

}

class SetSpawner extends System<[SpawnNext]> {
    sets: any[] = [];

    constructor() {
        super();

        // 47, 48
        const loader: TiledMapLoader = new TiledMapLoader(stuff);

        let currentSet: number[][] = [];

        loader.loadFn("Tile Layer 1", (tileId, x, y) => {
            if (tileId == 48) {
                this.sets.push(currentSet);
                currentSet = [];
                return;
            }
            if (tileId !== 0) {
                // tiles are 1 indexed in the save so 0 can be nothing
                currentSet.push([tileId - 1, x, y]);
            }
        })
    }

    update(delta: number): void {
        this.runOnEntities((entity, component) => {
           if (entity.transform.y <= -component.height) {
               Log.warn(entity.transform.y, component.height);
               component.destroy();
               let e = this.scene.addEntity(new Entity("set", 0, LD57.GAME_HEIGHT));
               e.addComponent(new MovingThing());
               const set = this.sets[MathUtil.randomRange(0, this.sets.length)];

               // Add a marker to spawn the next one
               let height = 0;

               // @ts-ignore
               set.forEach(([tileId, lx, y]) => {
                   const x = lx + 24;
                   height = Math.max(height, y);
                   // Each tileid represents a spawnable thing/sprite variant.
                   switch (tileId) {
                       case 9:
                           e.addChild(new Coin(x, y));
                       default: {
                           // static walls
                           e.addChild(new SolidTile(x, y, tileId));
                       }
                   }
               });

               e.addComponent(new SpawnNext(height + MathUtil.randomRange(0, 10 * 12)))
           }
        });
    }

    types = [SpawnNext];
}

export class DemoThings extends Entity {

    constructor() {
        super("demo", 0, 0);


    }

    onAdded() {
        super.onAdded();

        this.scene.addSystem(new SetSpawner());
        this.addComponent(new SpawnNext(0));
    }
}