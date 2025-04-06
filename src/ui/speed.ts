import {Entity, Sprite, System, TextDisp} from "lagom-engine";
import {LD57} from "../LD57.ts";
import {ThingMover} from "../MovingThing.ts";
import {PlayerMover} from "../Player.ts";

export class SpeedDisplay extends Entity {
    constructor() {
        super("speedDisplay", LD57.GAME_WIDTH + 5, 60);
    }

    onAdded() {
        super.onAdded();

        this.addComponent(new Sprite(this.scene.game.getResource("bar").textureFromIndex(0)));
        this.addComponent(new Indicator(this.scene.game.getResource("bar_indicator").textureFromIndex(0)));
        this.addComponent(new TextDisp(18, 122, "Multi\n", {
            fontFamily: "retro",
            fill: 0xfaf0b9,
            fontSize: 10,
        }));
        this.addComponent(new TextDisp(0, -16, "SPEED", {
            fontFamily: "retro",
            fill: 0xfaf0b9,
            fontSize: 12,
        }))
        this.scene.addSystem(new IndicatorMover());
    }
}

export class Indicator extends Sprite {

}

class IndicatorMover extends System<[Indicator, TextDisp]> {
    update(delta: number): void {
        this.runOnEntities((entity, indicator, txt) => {
            const speedPercentage = (ThingMover.velocity - PlayerMover.minSpeed) / (PlayerMover.maxSpeed - PlayerMover.minSpeed);
            indicator.applyConfig({yOffset: speedPercentage * (144 - 11)})
            txt.pixiObj.text = `Multi\nx${(1 + speedPercentage).toFixed(2)}`;
            txt.pixiObj.transform.position.y = speedPercentage * (144 - 11) - 2

            if (speedPercentage > 0.65) {
                txt.pixiObj.style.fill = 0xcc9a6e;
            } else {
                txt.pixiObj.style.fill = 0xfaf0b9;
            }
        });
    }

    types = [Indicator, TextDisp];
}