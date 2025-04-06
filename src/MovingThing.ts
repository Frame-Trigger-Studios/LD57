import {Component, Log, System} from "lagom-engine";
import {LD57} from "./LD57.ts";

export class MovingThing extends Component {
}

export class ThingMover extends System<[MovingThing]> {
    static velocity = 0.05;


    update(delta: number): void {
        this.runOnEntitiesWithSystem((system, entity) => {
            entity.transform.y -= ThingMover.velocity * delta;

            if (entity.transform.y < -LD57.GAME_HEIGHT - 20) {
                entity.destroy();
            }
        });
    }

    types = [MovingThing];
}