import Phaser, { GameObjects } from "phaser";
import Player from "../sprites/player";
import "../sprites/player";
import { EnemyShip } from "../sprites/enemy";
import { api } from "~/utils/api";
import { EventEmitter } from "~/utils/events";
import {
    IWaveEnemy,
    PlayerShip,
    PlayerShipWithEquipment,
    WaveSceneProps,
} from "~/utils/gameTypes";
import { getBossEnemy } from "~/utils/enemies";

// Create wave complete and game over events
// need wave completion scene before going back to game scene

export default class WaveScene extends Phaser.Scene {
    private player!: Player;
    private enemies!: Phaser.GameObjects.Group;
    private enemiesToLoad!: IWaveEnemy[];
    private ship!: PlayerShipWithEquipment;
    private emitter = EventEmitter.getInstance();
    private wave = 0;
    private timer = 0;

    constructor() {
        super("WaveScene");
    }

    init(data: WaveSceneProps) {
        // console.log('wavescene data:',data)
        this.enemiesToLoad = data.loadedEnemies;
        this.ship = data.ship;
        this.wave = data.wave;
    }

    create() {
        const { width, height } = this.game.canvas;
        const endWaveBtn = this.add
            .image(62, height - 20, "purpleButton")
            .setInteractive({ useHandCursor: true })
            .once("pointerdown", () => {
                this.scene.stop();
                this.scene.run("GameScene");
            });
        endWaveBtn.scaleX = 1.2;
        this.add.text(endWaveBtn.x, endWaveBtn.y, "End Wave").setOrigin(0.5);

        // Player
        this.player = this.add.player(width / 2, height / 1.2, this.ship);
        // Enemy Group
        this.enemies = this.add.group({
            classType: EnemyShip,
            runChildUpdate: true,
        });

        this.enemiesToLoad &&
            this.enemiesToLoad.forEach((enemy: IWaveEnemy) => {
                for (let i = 0; i < enemy.amount; i++) {
                    const newEnemy = this.enemies.add(
                        new EnemyShip(
                            this,
                            enemy.health,
                            enemy.startX[i]!,
                            enemy.startY,
                            enemy.sprite,
                            enemy.velocity,
                            enemy.bulletRange,
                            enemy.shootDelay,
                            enemy.bulletSpeed,
                            enemy.bulletDamage,
                            this.player,
                            false
                        )
                    );
                    this.physics.add.collider(
                        newEnemy,
                        this.player.getBullets(),
                        this.player.damageEnemy
                    );
                }
            });
        //console.log(this.wave, this.wave % 10 == 0);
        if (this.wave % 10 == 0) {
            const bossStats = getBossEnemy(width, this.wave);
            const boss = new EnemyShip(
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
            this.enemies.add(boss);
            this.physics.add.collider(
                boss,
                this.player.getBullets(),
                this.player.damageEnemy
            );
        }
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
            this.endWave(false);
        }

        if (this.enemies.getMatching("visible", true).length == 0) {
            console.log("enemy scum terminated!");
            this.endWave(true);
        }
    }

    findClosestEnemy = () => {
        const enemyUnits = this.enemies.getChildren();
        //console.log('targeting enemy!!!', this.enemies)
        const player = this.player;
        for (let i = 0; i < enemyUnits.length; i++) {
            const enemy = enemyUnits[i] as Phaser.Physics.Arcade.Sprite;
            //console.log('enemy, player', enemy , player, player.getBulletRange())
            if (
                enemy.active &&
                Phaser.Math.Distance.Between(
                    player.x,
                    player.y,
                    enemy.x,
                    enemy.y
                ) < player.getBulletRange()
            )
                //console.log('returned enemy', enemy as EnemyShip)
                return enemy as EnemyShip;
        }

        // the following finds the closest enemy, but currently doesn't discriminate if enemy has been killed
        // const closest = this.physics.closest(
        //     player,
        //     enemyUnits
        // ) as Phaser.Physics.Arcade.Sprite;
        // console.log("finding enemy");
        // if (
        //     closest.active &&
        //     Phaser.Math.Distance.Between(
        //         player.x,
        //         player.y,
        //         closest.x,
        //         closest.y
        //     ) < player.getBulletRange()
        // ) {
        //     return closest;
        // }
        //console.warn("no enemy found");
        return false;
    };

    endWave = (completed: boolean) => {
        const condition = completed ? "VICTORY" : "DEFEAT";
        this.scene.start("EndWaveScene", {
            condition: condition,
            ship: this.ship,
            wave: this.wave,
        });
        this.scene.stop();
    };
}
