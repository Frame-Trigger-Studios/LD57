import {
    ActionOnPress,
    AudioAtlas,
    CollisionMatrix,
    DebugCollisionSystem,
    Diagnostics,
    DiscreteCollisionSystem,
    Entity,
    FrameTriggerSystem,
    Game,
    Log,
    LogLevel,
    RenderRect,
    Scene,
    SpriteSheet,
    TextDisp,
    TimerSystem
} from 'lagom-engine';
import WebFont from 'webfontloader';
import muteButtonSpr from "./art/mute_button.png";
import {SoundManager} from "./util/SoundManager";
import ladySpr from "./art/lady.png";
import ladyFallSpr from "./art/lady_falling.png";
import ladyParaSpr from "./art/lady_parasol.png";
import tileSpr from "./art/tile.png";
import squareTileSpr from "./art/square_tiles.png";
import bgSquareTileSpr from "./art/bg_square_tiles.png";
import bgTileSpr from "./art/bg_tile.png";
import {SideWalls} from "./levelGen/tiles.ts";
import {Player} from "./Player.ts";
import {ThingMover} from "./MovingThing.ts";
import inputPaletteSpr from "./art/palettes/night-light-2-bit-1x.png"
import outputPaletteSpr from "./art/palettes/cmyk-douce-1x.png"
import coinSpr from "./art/coin.png"
import speedDown from "./art/wind_darker_2x.png"
import speedUp from "./art/down.png"
import barSpr from "./art/speedbar.png"
import barIndicatorSpr from "./art/bar_indicator.png"
import {BackgroundEntity, DemoThings} from "./DemoThings.ts";
import {ScoreDisplay} from "./ui/score";
import {SpeedDisplay} from "./ui/speed.ts";


export enum Layers {
    BACKGROUND,
    FOREGROUND,
    SPEED_UP,
    SPEED_DOWN,
    COIN,
    BLOCK,
    PLAYER,
    UI
}

class TitleScene extends Scene {
    onAdded() {
        super.onAdded();

        this.addGUIEntity(new SoundManager());
        this.addGlobalSystem(new TimerSystem());
        this.addGlobalSystem(new FrameTriggerSystem());

        this.addGUIEntity(new Entity("title")).addComponent(new TextDisp(100, 10, "LD57", {
            fontFamily: "retro",
            fill: 0xffffff
        }));

        this.addSystem(new ActionOnPress(() => {
            this.game.setScene(new MainScene(this.game))
        }));
    }
}

export class MainScene extends Scene {

    static physics: DiscreteCollisionSystem;

    constructor(game: Game) {
        super(game);

        const collisionMatrix = new CollisionMatrix();
        collisionMatrix.addCollision(Layers.PLAYER, Layers.COIN);
        collisionMatrix.addCollision(Layers.PLAYER, Layers.BLOCK);
        collisionMatrix.addCollision(Layers.PLAYER, Layers.SPEED_UP);
        collisionMatrix.addCollision(Layers.PLAYER, Layers.SPEED_DOWN);
        MainScene.physics = new DiscreteCollisionSystem(collisionMatrix);
    }

    onAdded() {
        super.onAdded();


        this.addGlobalSystem(MainScene.physics);
        this.addGlobalSystem(new DebugCollisionSystem(MainScene.physics));


        this.addGUIEntity(new SoundManager());
        // this.addGlobalSystem(new PaletteSwapper());
        this.addGlobalSystem(new TimerSystem());
        this.addGlobalSystem(new FrameTriggerSystem());

        // this.addGUIEntity(new Entity("main scene")).addComponent(new TextDisp(100, 10, "MAIN SCENE", {
        //     fontFamily: "pixeloid",
        //     fill: 0xffffff
        // }));

        this.addEntity(new Player());
        this.addSystem(new ThingMover());

        this.addEntity(new DemoThings());
        this.addEntity(new BackgroundEntity());
        this.addEntity(new SideWalls());
        // this.addGlobalSystem(new TileGenerator());

        this.addGUIEntity(new Diagnostics("red", 4, true));
        this.addGUIEntity(new ScoreDisplay(LD57.GAME_WIDTH + 10, 10));
        this.addGUIEntity(new SpeedDisplay());
        this.addEntity(new Entity("side_background", LD57.GAME_WIDTH, 0, Layers.BACKGROUND))
            .addComponent(new RenderRect(0, 0, LD57.VIEW_WIDTH - LD57.GAME_WIDTH, LD57.GAME_HEIGHT, 0x594f7d, 0x594f7d));
    }
}

export class LD57 extends Game {
    static GAME_WIDTH = 288;
    static VIEW_WIDTH = 384;
    static GAME_HEIGHT = 288;

    static muted = false;
    static musicPlaying = false;
    static audioAtlas: AudioAtlas = new AudioAtlas();

    static DEBUG = false;

    constructor() {
        super({
            width: LD57.VIEW_WIDTH,
            height: LD57.GAME_HEIGHT,
            resolution: 2,
            backgroundColor: 0x0B0926
        });

        // Set the global log level
        Log.logLevel = LogLevel.WARN;

        this.addResource("mute_button", new SpriteSheet(muteButtonSpr, 16, 16));
        this.addResource("tile", new SpriteSheet(tileSpr, 12, 12))
        this.addResource("sq_tile", new SpriteSheet(squareTileSpr, 12, 12))
        this.addResource("bg_sq_tile", new SpriteSheet(bgSquareTileSpr, 12, 12))
        this.addResource("bg_tile", new SpriteSheet(bgTileSpr, 12, 12))
        this.addResource("lady", new SpriteSheet(ladySpr, 12, 24))
        this.addResource("lady_falling", new SpriteSheet(ladyFallSpr, 36, 48))
        this.addResource("lady_para", new SpriteSheet(ladyParaSpr, 36, 48))
        this.addResource("coin", new SpriteSheet(coinSpr, 12, 12))
        this.addResource("speedDown", new SpriteSheet(speedDown, 12, 12))
        this.addResource("speedUp", new SpriteSheet(speedUp, 12, 12))
        this.addResource("inputPalette", new SpriteSheet(inputPaletteSpr, 4, 1))
        this.addResource("outputPalette", new SpriteSheet(outputPaletteSpr, 4, 1))
        this.addResource("bar", new SpriteSheet(barSpr, 16, 144))
        this.addResource("bar_indicator", new SpriteSheet(barIndicatorSpr, 16, 11))

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
