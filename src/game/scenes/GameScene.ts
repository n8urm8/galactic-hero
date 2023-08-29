import Phaser from "phaser";
import "../sprites/player";
import { EventEmitter, GameEvents, SceneEvents } from "~/utils/events";
import {
    IWaveEnemy,
    PlayerShipWithEquipment,
    PlayerWithInventory,
    SceneKeys,
} from "~/utils/gameTypes";
import { getTankEnemy, getNormalEnemy, getEliteEnemy } from "~/utils/enemies";

export default class GameScene extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Sprite;
    private enemies!: Phaser.GameObjects.Group;
    private emitter = EventEmitter.getInstance();
    private enemiesToLoad!: IWaveEnemy[];
    private profile!: PlayerWithInventory;
    private ship!: PlayerShipWithEquipment;
    private startWaveBtn?: Phaser.GameObjects.Image;
    private background: Phaser.GameObjects.TileSprite;
    private starsBackground: Phaser.GameObjects.TileSprite;
    private backgroundScroll = false;

    // TODO : update loadprofile event to update wave count and load new enemies

    constructor() {
        super("GameScene");
    }

    init(data: PlayerWithInventory) {
        this.profile = data;
        for (let i = 0; i < data.ships.length; i++) {
            if (data.ships[i]!.isCurrent) {
                this.ship = data.ships[i]!;
            }
        }
        this.backgroundScroll = false;
    }

    create() {
        const { width, height } = this.game.canvas;

        this.loadEnemies(width, this.profile.waves);
        this.background = this.add
            .tileSprite(width, height, 1024, 1024, "blueNebulaBackground")
            .setOrigin(1);
        this.starsBackground = this.add
            .tileSprite(0, 0, 1024, 1024, "starsBackground")
            .setOrigin(0)
            .setAlpha(0.7);
        this.emitter.emit(SceneEvents.waveInitializing, {
            endWave: false,
            gameLoaded: true,
        });

        // ui
        // this.startWaveBtn = new PurpleButton(
        //     this,
        //     62,
        //     height - 20,
        //     "Start Wave",
        //     this.startWave,
        //     undefined,
        //     1.2
        // );
    }

    update(time: number, delta: number) {
        if (this.backgroundScroll) {
            this.background.setTilePosition(
                0,
                this.background.tilePositionY - 0.15
            );
            this.starsBackground.setTilePosition(
                0,
                this.starsBackground.tilePositionY - 0.3
            );
        }
        this.emitter.on(
            GameEvents.profileLoaded,
            this.loadProfile,
            this.emitter.removeListener(GameEvents.profileLoaded)
        );
        this.emitter.on(
            SceneEvents.startWave,
            this.startWave,
            this.emitter.removeListener(SceneEvents.startWave)
        );
        this.emitter.on(
            SceneEvents.vanguardStarted,
            this.startVanguard,
            this.emitter.removeListener(SceneEvents.vanguardStarted)
        );
    }

    loadEnemies = (width: number, wave: number) => {
        this.enemiesToLoad = [
            getTankEnemy(width, wave),
            getNormalEnemy(width, wave),
            getEliteEnemy(width, wave),
        ];
    };

    startWave = () => {
        this.scene.run(SceneKeys.wave, {
            loadedEnemies: this.enemiesToLoad,
            ship: this.ship,
            wave: this.profile.waves,
        });
        this.backgroundScroll = true;
    };

    startVanguard = (data: { level: number }) => {
        //console.log("gamescene level", data.level);
        this.scene.run(SceneKeys.vanguard, {
            ship: this.ship,
            level: data.level,
        });
        this.backgroundScroll = true;
    };

    loadProfile = (data: PlayerWithInventory) => {
        this.profile = data;
        for (let i = 0; i < data.ships.length; i++) {
            //console.log("loaded new ship", data.ships[i]);
            if (data.ships[i].isCurrent) {
                this.ship = data.ships[i];
            }
        }
        //console.log("loaded new ship", this.ship);
        this.loadEnemies;
    };
}
