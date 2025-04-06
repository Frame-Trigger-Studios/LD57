import {Entity, TextDisp, Timer} from "lagom-engine";
import {LD57} from "../LD57.ts";
import {EndFloor} from "../endscreen.ts";
import {SolidTile, TileBase} from "../levelGen/tiles.ts";
import {ThingMover} from "../MovingThing.ts";

export class ScoreTimer extends Entity {
    constructor() {
        super("score_timer", LD57.GAME_WIDTH + 5, 210);
    }

    onAdded() {
        super.onAdded();

        const txt = this.addComponent(new TextDisp(0, 0, "TIME LEFT\nXX:XX", {
            fontFamily: "retro",
            fill: 0xfaf0b9,
            fontSize: 12
        }))

        let roundTime = 120;

        this.addComponent(new Timer(1000, txt, true)).onTrigger.register((caller, txt) => {
            roundTime -= 1;

            const mins = Math.max(0, Math.floor(roundTime / 60));
            const secs = Math.max(0, roundTime % 60);
            txt.pixiObj.text = `TIME LEFT\n${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

            if (roundTime == 30) {
                txt.pixiObj.style.fill = 0xcc9a6e;
            }

            if (roundTime == 0) {
                caller.destroy();

                // Game over. Do the following
                // - stop the score thing
                caller.getScene().getEntityWithName("scoreboard")?.getComponent(Timer)?.destroy();
                // - stop the spawner
                LD57.GAMEOVER = true;

                // - delete everything
                caller.getScene().entities.filter(entity => {
                    if (entity instanceof TileBase) {
                        return !(entity instanceof SolidTile && entity.dark);
                    }
                    return false;
                }).forEach((entity) => {
                    entity.destroy();
                });
                // - set our speed to minimum
                ThingMover.velocity = 0;

                // - spawn the end thing
                this.scene.addEntity(new EndFloor());
            }
        })

    }
}