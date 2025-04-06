import {Component, System} from "lagom-engine";
import {LD57} from "./LD57.ts";

export class MovingThing extends Component {
}

export class ThingMover extends System<[MovingThing]> {
    static velocity = 0.05;
    static gameOver = false;

    update(delta: number): void {
        if (ThingMover.gameOver) {
            return;
        }
        this.runOnEntitiesWithSystem((system, entity) => {
            if (LD57.GAMEOVER) return;
            entity.transform.y -= ThingMover.velocity * delta;

            if (entity.transform.y < -LD57.GAME_HEIGHT - 20) {
                entity.destroy();
            }
        });
    }

    types = [MovingThing];
}
