import {Entity, TextDisp, Timer} from "lagom-engine";
import * as PIXI from "pixi.js";
import {ThingMover} from "../MovingThing.ts";
import {PlayerMover} from "../Player.ts";

export class ScoreText extends TextDisp {
    private score: number;

    constructor(xOff: number, yOff: number, private readonly prefix: string, options: Partial<PIXI.ITextStyle>) {
        super(xOff, yOff, prefix + "0", options);
        this.prefix = prefix;
        this.score = 0;
    }

    addScore(score: number) {
        this.score += score;
        this.pixiObj.text = this.prefix + this.score.toFixed(0)
    }
}

export class ScoreDisplay extends Entity {

    constructor(x: number, y: number) {
        super("scoreboard", x, y,);
    }

    onAdded() {
        super.onAdded();
        const score = this.addComponent(new ScoreText(0, 0, "Score\n", {
            fontFamily: "retro",
            fill: 0xfaf0b9,
            fontSize: 12,
        }));

        this.addComponent(new Timer(100, score, true)).onTrigger.register((caller, data) => {
            const multiplier = (ThingMover.velocity - PlayerMover.minSpeed) / (PlayerMover.maxSpeed - PlayerMover.minSpeed);
            data.addScore(1 * (1 + multiplier));
        })
    }
}

