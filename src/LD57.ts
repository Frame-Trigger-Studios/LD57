import {
    ActionOnPress,
    AudioAtlas,
    Entity,
    FrameTriggerSystem,
    Game,
    Log,
    LogLevel,
    Scene,
    SpriteSheet,
    TextDisp,
    TiledMapLoader,
    TimerSystem
} from 'lagom-engine';
import WebFont from 'webfontloader';
import muteButtonSpr from "./art/mute_button.png";
import {SoundManager} from "./util/SoundManager";
import ladySpr from "./art/lady.png";
import tileSpr from "./art/tile.png";
import {TileGenerator} from "./levelGen/tiles.ts";
import {Player} from "./Player.ts";
import {ThingMover} from "./MovingThing.ts";
import inputPaletteSpr from "./art/palettes/night-light-2-bit-1x.png"
import outputPaletteSpr from "./art/palettes/cmyk-douce-1x.png"
import coinSpr from "./art/coin.png"
import {PaletteSwapper} from "./paletteSwapper.ts";
import {DemoThings} from "./DemoThings.ts";


export enum Layers {
    BACKGROUND,
    FOREGROUND,
    Player,
    UI
}

class TitleScene extends Scene {
    onAdded() {
        super.onAdded();

        this.addGUIEntity(new SoundManager());
        this.addGlobalSystem(new TimerSystem());
        this.addGlobalSystem(new FrameTriggerSystem());

        this.addGUIEntity(new Entity("title")).addComponent(new TextDisp(100, 10, "LD57", {fontFamily: "retro", fill: 0xffffff}));

        this.addSystem(new ActionOnPress(() => {
            this.game.setScene(new MainScene(this.game))
        }));
    }
}

class MainScene extends Scene
{
    onAdded() {
        super.onAdded();

        this.addGUIEntity(new SoundManager());
        // this.addGlobalSystem(new PaletteSwapper());
        this.addGlobalSystem(new TimerSystem());
        this.addGlobalSystem(new FrameTriggerSystem());

        this.addGUIEntity(new Entity("main scene")).addComponent(new TextDisp(100, 10, "MAIN SCENE", {fontFamily: "pixeloid", fill: 0xffffff}));

        this.addEntity(new Player());
        this.addSystem(new ThingMover())

        // TODO remove me
        this.addEntity(new DemoThings());
        // this.addGlobalSystem(new TileGenerator());
    }
}

export class LD57 extends Game
{
    static GAME_WIDTH = 288;
    static GAME_HEIGHT = 288;

    static muted = false;
    static musicPlaying = false;
    static audioAtlas: AudioAtlas = new AudioAtlas();

    constructor()
    {
        super({
            width: LD57.GAME_WIDTH,
            height: LD57.GAME_HEIGHT,
            resolution: 2,
            backgroundColor: 0x0B0926
        });

        // Set the global log level
        Log.logLevel = LogLevel.WARN;

        this.addResource("mute_button", new SpriteSheet(muteButtonSpr, 16, 16));
        this.addResource("tile", new SpriteSheet(tileSpr, 12, 12))
        this.addResource("lady", new SpriteSheet(ladySpr, 12, 24))
        this.addResource("coin", new SpriteSheet(coinSpr, 12, 12))
        this.addResource("inputPalette", new SpriteSheet(inputPaletteSpr, 4, 1))
        this.addResource("outputPalette", new SpriteSheet(outputPaletteSpr, 4, 1))

        // Load an empty scene while we async load the resources for the main one
        this.setScene(new Scene(this));

        // Import sounds and set their properties
        // const music = LD57.audioAtlas.load("music", "ADD_ME")
        //     .loop(true)
        //     .volume(0.3);

        // Import fonts. See index.html for examples of how to add new ones.
        const fonts = new Promise<void>((resolve, _) => {
            WebFont.load({
                custom: {
                    families: ["pixeloid", "retro"]
                },
                active() {
                    resolve();
                }
            });
        });

        // Wait for all resources to be loaded and then start the main scene.
        Promise.all([fonts, this.resourceLoader.loadAll()]).then(
            () => {
                this.setScene(new MainScene(this));
            }
        )

    }
}
