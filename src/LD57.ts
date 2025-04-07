import {
    AudioAtlas,
    CollisionMatrix,
    Component,
    DiscreteCollisionSystem,
    Entity,
    FrameTriggerSystem,
    Game,
    Key,
    Log,
    LogLevel,
    RenderRect,
    Scene,
    ScreenShaker,
    SpriteSheet,
    System,
    TextDisp,
    Timer,
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
import {Player, PlayerMover} from "./Player.ts";
import {ThingMover} from "./MovingThing.ts";
import inputPaletteSpr from "./art/palettes/night-light-2-bit-1x.png"
import outputPaletteSpr from "./art/palettes/cmyk-douce-1x.png"
import coinSpr from "./art/coin.png"
import coinGetSpr from "./art/coin_get.png"
import hitBlockSpr from "./art/hit_block.png"
import speedDown from "./art/wind_darker_2x.png"
import speedUp from "./art/down.png"
import barSpr from "./art/speedbar.png"
import barIndicatorSpr from "./art/bar_indicator.png"
import {BackgroundEntity, DemoThings} from "./DemoThings.ts";
import {ScoreDisplay} from "./ui/score";
import {SpeedDisplay} from "./ui/speed.ts";
import {ScoreTimer} from "./ui/timer.ts";

import beepSfx from "./sfx/beep.wav";
import coinSfx from "./sfx/coin.wav";
import gameoverSfx from "./sfx/gameover.wav";
import landSfx from "./sfx/land.wav";
import slowSfx from "./sfx/slow.wav";
import speedupSfx from "./sfx/speedup.wav";
import wallhitSfx from "./sfx/wallhit.wav";

import gameMusic from "./music/LD57-v1.mp3";


export enum Layers {
    BACKGROUND,
    FOREGROUND,
    SPEED_UP,
    SPEED_DOWN,
    COIN,
    BLOCK,
    FLOOR,
    PLAYER,
    UI,
}

class SpaceToStart extends Component {
    constructor(readonly startFn: () => void) {
        super()
    }
}

class SpaceToStartSystem extends System<[SpaceToStart]> {
    update(delta: number): void {
        this.runOnEntities((entity, component) => {
            if (this.getScene().game.keyboard.isKeyPressed(Key.Space)) {
                PlayerMover.DO_ACCEL = true;
                component.startFn();
                entity.destroy();
            }
        })
    }

    types = [SpaceToStart];

}

class StartMenu extends Entity {

    constructor() {
        super("startmenu", 0, 0, Layers.FOREGROUND);
    }

    onAdded() {
        super.onAdded();

        PlayerMover.DO_ACCEL = false;

        this.addComponent(new Timer(1000, null, false)).onTrigger.register(caller => {
            caller.getScene().addSystem(new SpaceToStartSystem());
        })
        this.addComponent(new SpaceToStart(() => {
            startGame(this.scene);
        }));

        this.addComponent(new TextDisp(LD57.GAME_WIDTH / 2, 100, "Diva Descent", {
            fontFamily: "retro",
            fill: 0xfaf0b9,
            fontSize: 20,
        })).pixiObj.anchor.set(0.5, 0);

        this.addComponent(new TextDisp(LD57.GAME_WIDTH / 2, 140, "Press <SPACE>\nto start", {
            fontFamily: "retro",
            fill: 0xfaf0b9,
            align: "center",
            fontSize: 16,
        })).pixiObj.anchor.set(0.5, 0);

        this.addComponent(new TextDisp(30, LD57.GAME_HEIGHT - 30, "LD57 Entry by Quackqack,\nMasterage + Earlybard", {
            fontFamily: "retro",
            fill: 0xfaf0b9,
            fontSize: 12,
        }))
    }
}

function startGame(scene: Scene) {
    scene.addEntity(new DemoThings());
    scene.addGUIEntity(new ScoreDisplay(LD57.GAME_WIDTH + 5, 10));
    scene.addGUIEntity(new SpeedDisplay());
    scene.addGUIEntity(new ScoreTimer()).addComponent(new Timer(100, null)).onTrigger.register(caller => {
        PlayerMover.MAKE_SOUND = true;
    });
}

export class MainScene extends Scene {

    static physics: DiscreteCollisionSystem;
    static sound: SoundManager;

    constructor(game: Game, readonly firstLoad = true) {
        super(game);

        const collisionMatrix = new CollisionMatrix();
        collisionMatrix.addCollision(Layers.PLAYER, Layers.COIN);
        collisionMatrix.addCollision(Layers.PLAYER, Layers.BLOCK);
        collisionMatrix.addCollision(Layers.PLAYER, Layers.SPEED_UP);
        collisionMatrix.addCollision(Layers.PLAYER, Layers.SPEED_DOWN);
        collisionMatrix.addCollision(Layers.PLAYER, Layers.FLOOR);
        MainScene.physics = new DiscreteCollisionSystem(collisionMatrix);
    }

    onAdded() {
        super.onAdded();

        this.addGUIEntity(new Entity("side_background", LD57.GAME_WIDTH, 0, Layers.BACKGROUND))
            .addComponent(new RenderRect(0, 0, LD57.VIEW_WIDTH - LD57.GAME_WIDTH, LD57.GAME_HEIGHT, 0x594f7d, 0x594f7d));

        this.addGlobalSystem(MainScene.physics);
        // this.addGlobalSystem(new DebugCollisionSystem(MainScene.physics));

        if (this.firstLoad) {
            this.addGUIEntity(new StartMenu());
        } else {
            startGame(this);
        }

        MainScene.sound = this.addGUIEntity(new SoundManager());

        // this.addGlobalSystem(new PaletteSwapper());
        this.addGlobalSystem(new TimerSystem());
        this.addGlobalSystem(new FrameTriggerSystem());
        this.addGlobalSystem(new ScreenShaker(LD57.GAME_WIDTH / 2, LD57.GAME_HEIGHT / 2));

        this.addEntity(new Player());
        this.addSystem(new ThingMover());

        this.addEntity(new BackgroundEntity());
        this.addEntity(new SideWalls());
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
    static GAMEOVER = false;

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
        this.addResource("coin_get", new SpriteSheet(coinGetSpr, 36, 36))
        this.addResource("hit_block", new SpriteSheet(hitBlockSpr, 36, 36))
        this.addResource("speedDown", new SpriteSheet(speedDown, 12, 12))
        this.addResource("speedUp", new SpriteSheet(speedUp, 12, 12))
        this.addResource("inputPalette", new SpriteSheet(inputPaletteSpr, 4, 1))
        this.addResource("outputPalette", new SpriteSheet(outputPaletteSpr, 4, 1))
        this.addResource("bar", new SpriteSheet(barSpr, 16, 144))
        this.addResource("bar_indicator", new SpriteSheet(barIndicatorSpr, 16, 11))

        // Load an empty scene while we async load the resources for the main one
        this.setScene(new Scene(this));

        LD57.audioAtlas.load("beep", beepSfx);
        LD57.audioAtlas.load("coin", coinSfx);
        LD57.audioAtlas.load("gameover", gameoverSfx);
        LD57.audioAtlas.load("land", landSfx);
        LD57.audioAtlas.load("slow", slowSfx).volume(0.5);
        LD57.audioAtlas.load("speedup", speedupSfx);
        LD57.audioAtlas.load("wallhit", wallhitSfx).volume(0.5);

        // Import sounds and set their properties
        const music = LD57.audioAtlas.load("music", gameMusic)
            .loop(true)
            .volume(1);

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
