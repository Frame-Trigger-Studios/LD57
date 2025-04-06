import {Entity, TextDisp, Timer} from "lagom-engine";
import {LD57} from "../LD57.ts";

export class ScoreTimer extends Entity {
    constructor() {
        super("score_timer", LD57.GAME_WIDTH + 10, 220);
    }

    onAdded() {
        super.onAdded();

        const txt = this.addComponent(new TextDisp(0, 0, "00:00", {
            fontFamily: "retro",
            fill: 0xfaf0b9,
            fontSize: 16
        }))

        let roundTime = 66;

        this.addComponent(new Timer(1000, txt, true)).onTrigger.register((caller, txt) => {
            roundTime -= 1;

            const mins = Math.max(0, Math.floor(roundTime / 60));
            const secs = Math.max(0, roundTime % 60);
            txt.pixiObj.text = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        })

    }
}