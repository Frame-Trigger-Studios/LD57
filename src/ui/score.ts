import {Entity, TextDisp} from "lagom-engine";

export class ScoreText extends TextDisp {
    private score: number;

    constructor(xOff: number, yOff: number, private readonly prefix: string, options: Partial<ITextStyle>) {
        super(xOff, yOff, prefix + " 0", options);
        this.prefix = prefix;
        this.score = 0;
    }

    addScore(score: number) {
        this.score += score;
        this.pixiObj.text = this.prefix + this.score
    }
}

export class ScoreDisplay extends Entity {

    constructor(x: number, y: number) {
        super("scoreboard", x, y, );
    }

    onAdded() {
        super.onAdded();
        this.addComponent(new TextDisp(0, 0, "", {dropShadowDistance: 10}))
        this.addComponent(new ScoreText(0, 0, "Score: ", {
            fontFamily: "pixeloid",
            fill: 0xffffff,
            fontSize: 20,
        }));
    }
}

