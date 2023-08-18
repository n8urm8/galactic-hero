import Phaser, { GameObjects } from "phaser";
import Player from "../sprites/player";
import "../sprites/player";
import { EnemyShip } from "../sprites/enemy";
import { api } from "~/utils/api";
import { EventEmitter, GameEvents } from "~/utils/events";
import { IWaveEnemy, PlayerShipWithEquipment } from "~/utils/gameTypes";
import { getBossEnemy } from "~/utils/enemies";

// Create wave complete and game over events
// need wave completion scene before going back to game scene

export default class WaveScene extends Phaser.Scene {
    private player!: Player;
    private asteroids!: Phaser.GameObjects.Group;
    private boss: EnemyShip;
    private ship!: PlayerShipWithEquipment;
    private emitter = EventEmitter.getInstance();
    private level = 0;
    private timer = 0;

    constructor() {
        super("WaveScene");
    }

    init(data: { ship: PlayerShipWithEquipment; level: number }) {
        // console.log('wavescene data:',data)
        this.ship = data.ship;
        this.level = data.level;
    }

    create() {
        const { width, height } = this.game.canvas;

        // Player
        this.player = this.add.player(width / 2, height / 1.2, this.ship);
        // asteroids Group
        this.asteroids = this.add.group({
            classType: EnemyShip,
            runChildUpdate: true,
        });

        const bossStats = getBossEnemy(width, this.level);
        this.boss = new EnemyShip(
            this,
            bossStats.health,
            bossStats.startX[0],
            bossStats.startY,
            bossStats.sprite,
            bossStats.velocity,
            bossStats.bulletRange,
            bossStats.shootDelay,
            bossStats.bulletSpeed,
            bossStats.bulletDamage,
            this.player,
            true
        );
        //this.enemies.add(boss);
        this.physics.add.collider(
            this.boss,
            this.player.getBullets(),
            this.player.damageEnemy
        );
    }

    update(time: number, delta: number) {
        //super.update(time, delta);
        this.timer += delta;
        //console.log(time, delta, this.timer);
        if (this.timer >= 300) {
            const target = this.findClosestEnemy();
            //console.log("enemy found", target);
            target && this.player.setEnemy(target);
            this.timer = 0;
        }

        this.player.update(time, delta);

        if (this.player.getCurrentHP() <= 0) {
            console.log("looooossssseeerrrrr");
            this.endVanguard(false);
        }

        if (this.boss.getHealth() <= 0) {
            console.log("enemy scum terminated!");
            this.endVanguard(true);
        }

        // this.emitter.on(
        //     GameEvents.endWave,
        //     () => {
        //         this.endWave(false);
        //     },
        //     this.emitter.removeListener(GameEvents.endWave)
        // );
    }

    findClosestEnemy = () => {
        return this.boss;
    };

    endVanguard = (completed: boolean) => {
        const condition = completed ? "VICTORY" : "DEFEAT";
        console.log("vanguard complete!", condition);
        // this.scene.start("EndWaveScene", {
        //     condition: condition,
        //     ship: this.ship,
        //     wave: this.wave,
        // });
    };
}
