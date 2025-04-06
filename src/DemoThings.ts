import {Component, Entity, Log, MathUtil, System, TiledMapLoader} from "lagom-engine";
import {MovingThing, ThingMover} from "./MovingThing.ts";
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
        let yoffset = 0;

        loader.loadFn("Tile Layer 1", (tileId, x, y) => {
            if (tileId == 48) {
                this.sets.push(currentSet);
                currentSet = [];
                yoffset = y;
                return;
            }
            if (tileId !== 0) {
                // tiles are 1 indexed in the save so 0 can be nothing
                currentSet.push([tileId - 1, x, y - yoffset]);
            }
        })
    }

    update(delta: number): void {
        this.runOnEntities((entity, component) => {
            entity.transform.y -= ThingMover.velocity * delta;

            if (entity.transform.y <= -component.height) {
                Log.warn("Spawning");
                component.destroy();
                let e = this.scene.addEntity(new Entity("set", 0, LD57.GAME_HEIGHT));
                // e.addComponent(new MovingThing());
                const set = this.sets[0];//this.sets[MathUtil.randomRange(0, this.sets.length)];

                // Add a marker to spawn the next one
                let height = 0;

                // @ts-ignore
                set.forEach(([tileId, lx, y]) => {
                    const x = lx + 24;
                    height = Math.max(height, y);
                    // Each tileid represents a spawnable thing/sprite variant.
                    // TODO these should be able to live on the parent entity, but they aren't getting cleaned up properly.
                    switch (tileId) {
                        case 9:
                            this.scene.addEntity(new Coin(x, y + LD57.GAME_HEIGHT)).addComponent(new MovingThing());
                            break;
                        default: {
                            // static walls
                            this.scene.addEntity(new SolidTile(x, y + LD57.GAME_HEIGHT, tileId)).addComponent(new MovingThing());
                        }
                    }
                });

                e.addComponent(new SpawnNext(height + MathUtil.randomRange(0, 2 * 12)));
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