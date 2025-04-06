import {
    ActionOnPress,
    AnimatedSpriteController,
    Entity,
    Key,
    MathUtil,
    RectCollider,
    Sprite,
    TextDisp
} from "lagom-engine";
import {Layers, LD57, MainScene} from "./LD57.ts";
import {PlayerPhys} from "./Player.ts";
import {ScoreText} from "./ui/score.ts";

export class EndFloor extends Entity {

    constructor() {
        super("floor", 0, LD57.GAME_HEIGHT - 12, Layers.BACKGROUND);
    }

    onAdded() {
        super.onAdded();

        const tiles = this.scene.game.getResource("sq_tile");
        for (let i = 0; i < LD57.GAME_WIDTH / 12; i++) {

            this.addComponent(new Sprite(tiles.texture(MathUtil.randomRange(0, 48), 0), {xOffset: i * 12}));

            this.addComponent(new RectCollider(MainScene.physics, {
                layer: Layers.FLOOR,
                width: LD57.GAME_WIDTH, height: 12,
                yOff: -4
            })).onTriggerEnter.register(caller => {
                const player = caller.getScene().getEntityWithName("player");
                player?.getComponent(PlayerPhys)?.destroy();
                player?.getComponent<AnimatedSpriteController>(AnimatedSpriteController)?.applyConfig({
                    animationSpeed: 9999999999,
                    rotation: 0
                })

                // Put the score up
                const e = this.scene.addGUIEntity(new Entity("endcontro ls", 0, 0, Layers.FOREGROUND));
                e.addComponent(new TextDisp(LD57.GAME_WIDTH / 2, 40, "FINAL SCORE", {
                    fontFamily: "retro",
                    align: "center",
                    fill: 0xfaf0b9,
                    fontSize: 16,
                })).pixiObj.anchor.set(0.5);


                // fetch the final score
                const score = this.scene.getEntityWithName("scoreboard")?.getComponent<ScoreText>(ScoreText)?.score;

                e.addComponent(new TextDisp(LD57.GAME_WIDTH / 2, 65, <string>score?.toFixed(0), {
                    fontFamily: "retro",
                    align: "center",
                    fill: 0xfaf0b9,
                    fontSize: 14,
                })).pixiObj.anchor.set(0.5);


                e.addComponent(new TextDisp(LD57.GAME_WIDTH / 2, 180, "Press <SPACE>\nto play again", {
                    fontFamily: "retro",
                    align: "center",
                    fill: 0xfaf0b9,
                    fontSize: 14,
                })).pixiObj.anchor.set(0.5);

                this.scene.addSystem(new ActionOnPress(() => {
                    LD57.GAMEOVER = false;
                    this.scene.game.setScene(new MainScene(this.scene.game))
                }, [Key.Space]));
            });
        }
    }
}