import {AnimatedSpriteController, Button, Component, Entity, Key, System, Timer} from "lagom-engine";

import {LD57} from "../LD57.ts";

class MuteComp extends Component {
}

class MuteListener extends System<[AnimatedSpriteController, MuteComp]> {
    types = [AnimatedSpriteController, MuteComp];

    update(delta: number): void {
        this.runOnEntities((e: Entity, spr: AnimatedSpriteController) => {
            if (this.scene.game.mouse.isButtonPressed(Button.LEFT)) {
                const pos = e.scene.game.renderer.plugins.interaction.mouse.global;

                if (pos.x >= LD57.VIEW_WIDTH - 24 && pos.x <= LD57.VIEW_WIDTH - 8 && pos.y >= LD57.GAME_HEIGHT - 24 && pos.y <= LD57.GAME_HEIGHT - 8) {
                    (e.scene.getEntityWithName("audio") as SoundManager).toggleMute();
                    spr.setAnimation(Number(LD57.muted));
                }
            } else if (this.scene.game.keyboard.isKeyPressed(Key.KeyM)) {
                (e.scene.getEntityWithName("audio") as SoundManager).toggleMute();
                spr.setAnimation(Number(LD57.muted));
            }
        });
    }
}

export class SoundManager extends Entity {
    constructor() {
        super("audio", LD57.VIEW_WIDTH - 16 - 8, LD57.GAME_HEIGHT - 24, 0);
        this.startMusic();
    }

    onAdded(): void {
        super.onAdded();

        this.addComponent(new MuteComp());
        const spr = this.addComponent(new AnimatedSpriteController(Number(LD57.muted), [
            {
                id: 0,
                textures: [this.scene.game.getResource("mute_button").texture(0, 0, 16, 16)]
            }, {
                id: 1,
                textures: [this.scene.game.getResource("mute_button").texture(1, 0, 16, 16)]
            }]));

        this.addComponent(new Timer(50, spr, false)).onTrigger.register((caller, data) => {
            data.setAnimation(Number(LD57.muted));
        });

        this.scene.addSystem(new MuteListener());
    }

    toggleMute() {
        LD57.muted = !LD57.muted;

        if (LD57.muted) {
            this.stopAllSounds();
        } else {
            this.startMusic();
        }
    }

    startMusic() {
        if (!LD57.muted && !LD57.musicPlaying) {
            LD57.audioAtlas.play("music");
            LD57.musicPlaying = true;
        }
    }

    stopAllSounds(music = true) {
        if (music) {
            LD57.audioAtlas.sounds.forEach((v: any, k: string) => v.stop());
            LD57.musicPlaying = false;
        } else {
            LD57.audioAtlas.sounds.forEach((v: any, k: string) => {
                if (k !== "music") v.stop();
            });
        }
    }

    onRemoved(): void {
        super.onRemoved();
        this.stopAllSounds(false);
    }

    playSound(name: string, restart = false) {
        if (!LD57.muted) {
            if (LD57.audioAtlas.sounds.get(name)?.playing() && !restart) return;
            LD57.audioAtlas.play(name);
        }
    }

    stopSound(name: string) {
        LD57.audioAtlas.sounds.forEach((value, key) => {
            if (key === name) {
                value.stop();
            }
        })
    }
}
