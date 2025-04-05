import {Component, System} from "lagom-engine";

export class MovingThing extends Component
{
}

export class ThingMover extends System<[MovingThing]>
{
    static velocity = 0.05;

    update(delta: number): void
    {
        this.runOnEntitiesWithSystem((system, entity) => {
            entity.transform.y -= ThingMover.velocity * delta;
        });
    }

    types = [MovingThing];
}