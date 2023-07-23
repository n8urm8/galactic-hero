import Phaser from "phaser";
import "../sprites/player";
import { EventEmitter, GameEvents } from "~/utils/events";
import { IWaveEnemy, PlayerWithInventory } from "~/utils/gameTypes";
import { getTankEnemy, getNormalEnemy, getEliteEnemy } from "~/utils/enemies";
import { PurpleButton } from "../objects/purpleButton";
import { Equipment } from "@prisma/client";

export default class GameScene extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Sprite;
    private enemies!: Phaser.GameObjects.Group;
    private emitter = EventEmitter.getInstance();
    private enemiesToLoad!: IWaveEnemy[];
    private profile!: PlayerWithInventory;
    private ship: any;
    private startWaveBtn?: Phaser.GameObjects.Image;

    // TODO : update loadprofile event to update wave count and load new enemies

    constructor() {
        super("GameScene");
    }

    init(data: any) {
        this.profile = data;
        for (let i = 0; i < data.ships.length; i++) {
            if (data.ships[i].isCurrent) {
                this.ship = data.ships[i];
            }
        }
    }

    create() {
        let { width, height } = this.game.canvas;

        this.loadEnemies(width, this.profile.waves);
        this.add.image(width / 2, height / 2, "nebulaBackground");
        this.add.image(width / 2, height / 2, "starsBackground");
        // ui
        this.startWaveBtn = new PurpleButton(
            this,
            62,
            height - 20,
            "Start Wave",
            this.startWave,
            undefined,
            1.2
        );
    }

    update(time: number, delta: number) {
        this.emitter.on(
            GameEvents.profileLoaded,
            this.loadProfile,
            this.emitter.removeListener(GameEvents.profileLoaded)
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
        this.scene.run("WaveScene", {
            loadedEnemies: this.enemiesToLoad,
            player: this.ship,
            wave: this.profile.waves,
        });
    };

    loadProfile = (data: PlayerWithInventory) => {
        this.profile = data;
        this.loadEnemies;
    };
}
