import {Entity, Log, Sprite, System} from "lagom-engine";
import {LD57} from "../LD57.ts";
import {ThingMover} from "../MovingThing.ts";
import {PlayerMover} from "../Player.ts";

export class SpeedDisplay extends Entity {
    constructor() {
        super("speedDisplay", LD57.GAME_WIDTH + 10, 50);
    }

    onAdded() {
        super.onAdded();

        this.addComponent(new Sprite(this.scene.game.getResource("bar").textureFromIndex(0)));
        this.addComponent(new Indicator(this.scene.game.getResource("bar_indicator").textureFromIndex(0)));
        this.scene.addSystem(new IndicatorMover());
    }
}

export class Indicator extends Sprite {

}

class IndicatorMover extends System<[Indicator]> {
    update(delta: number): void {
        this.runOnEntities((entity, indicator) => {
            const speedPercentage = (ThingMover.velocity - PlayerMover.minSpeed) / (PlayerMover.maxSpeed - PlayerMover.minSpeed);
            indicator.applyConfig({yOffset: speedPercentage * (144 - 11)})
        });
    }

    types = [Indicator];
}