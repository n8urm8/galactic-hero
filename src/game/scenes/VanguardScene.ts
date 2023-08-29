import Phaser, { GameObjects } from "phaser";
import Player from "../sprites/player";
import "../sprites/player";
import { EnemyShip } from "../sprites/enemy";
import { api } from "~/utils/api";
import { EventEmitter, GameEvents, SceneEvents } from "~/utils/events";
import { IWaveEnemy, PlayerShipWithEquipment } from "~/utils/gameTypes";
import { getBossEnemy, getVanguardBoss } from "~/utils/enemies";

// Create wave complete and game over events
// need wave completion scene before going back to game scene

export default class VanguardScene extends Phaser.Scene {
    private player!: Player;
    private asteroidGroup!: Phaser.GameObjects.Group;
    private boss: EnemyShip;
    private ship!: PlayerShipWithEquipment;
    private emitter = EventEmitter.getInstance();
    private level = 0;
    private timer = 0;
    private condition = "DEFEAT";
    private conditionText: Phaser.GameObjects.Text;
    private container: Phaser.GameObjects.Container;
    private updateObjects = true;

    constructor() {
        super("VanguardScene");
    }

    init(data: { ship: PlayerShipWithEquipment; level: number }) {
        // console.log('wavescene data:',data)
        this.ship = data.ship;
        this.level = data.level;
        this.updateObjects = true;
    }

    create() {
        const { width, height } = this.game.canvas;

        // end of vanguard ui
        this.container = this.add
            .container(width / 2, height / 2.5)
            .setVisible(false);
        const endWaveModal = this.add.image(0, 0, "goldSquare");
        endWaveModal.scaleX = 1.5;
        const endWaveBtn = this.add
            .image(0, +40, "purpleButton")
            .setInteractive({ useHandCursor: true })
            .once("pointerdown", () => {
                this.scene.start("GameScene");
            });
        endWaveBtn.scaleX = 1.2;
        const btnText = this.add
            .text(endWaveBtn.x, endWaveBtn.y, "Complete")
            .setOrigin(0.5);
        this.conditionText = this.add
            .text(endWaveModal.x, endWaveModal.y - 30, this.condition, {
                fontSize: "40px",
                color: "#fff",
                shadow: {
                    fill: true,
                    blur: 5,
                    color: "#000000",
                    offsetY: 2,
                    offsetX: 2,
                },
            })
            .setOrigin(0.5);

        this.container
            .add([endWaveModal, endWaveBtn, this.conditionText, btnText])
            .setDepth(1);

        // Player
        this.player = this.add.player(width / 2, height / 1.2, this.ship);
        this.player.setVanguard();
        // asteroids Group
        this.asteroidGroup = this.add.group({
            defaultKey: "asteroid",
            classType: Phaser.Physics.Arcade.Sprite,
            maxSize: 100,
        });
        this.time.addEvent({
            delay: 500,
            loop: true,
            callback: () => this.addAsteroid(),
        });

        const bossStats = getVanguardBoss(width, this.level);
        //console.log(bossStats);
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
        if (this.updateObjects) {
            this.player.update(time, delta);
            this.boss.update(time, delta);
            if (this.player.getCurrentHP() <= 0) {
                //console.log("looooossssseeerrrrr");
                this.endVanguard(false);
            }

            if (this.boss.getHealth() <= 0) {
                this.endVanguard(true);
            }
        }

        this.asteroidGroup.children.iterate((asteroid) => {
            const a1 = asteroid as Phaser.GameObjects.Sprite;
            if (a1.y > 600) {
                this.asteroidGroup.killAndHide(asteroid);
            }
            a1.angle += 1;
        });
    }

    findClosestEnemy = () => {
        return this.boss.active &&
            Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                this.boss.x,
                this.boss.y
            ) < this.player.getBulletRange()
            ? this.boss
            : false;
    };

    endVanguard = (completed: boolean) => {
        // need to figure out how to stop boss and player interactions
        this.condition = completed ? "VICTORY" : "DEFEAT";
        this.conditionText.setText(this.condition);

        //console.log("vanguard complete!", this.condition, completed);
        if (completed) {
            // insert api to get rewards and update vanguard level
            this.emitter.emit(SceneEvents.vanguardComplete, {
                level: this.level,
            });
            //this.emitter.emit(SceneEvents.waveCompleted);
            //this.boss.play("nairanDreadnoughtExplosion");
            this.updateObjects = false;
            this.showEndMenu();
        } else {
            this.updateObjects = false;
            this.showEndMenu();
        }
    };

    activateAsteroid(asteroid: Phaser.Physics.Arcade.Sprite) {
        this.physics.world.enableBody(
            asteroid,
            Phaser.Physics.Arcade.DYNAMIC_BODY
        );
        this.add.existing(asteroid);
        asteroid.setActive(true).setVisible(true);
        asteroid.setImmovable(true);

        const newScale = Phaser.Math.FloatBetween(0.5, 1.5);
        asteroid.setScale(newScale);

        asteroid.setVelocityY(Phaser.Math.Between(80, 160));
        this.physics.add.collider(asteroid, this.player, () =>
            this.damagePlayer(asteroid)
        );
    }

    addAsteroid() {
        const { width } = this.game.canvas;

        const x = Phaser.Math.Between(0, width);
        const y = Phaser.Math.Between(-64, 0);

        const asteroid: Phaser.GameObjects.Sprite = this.asteroidGroup.get(
            x,
            y
        );

        if (!asteroid) {
            return;
        }

        this.activateAsteroid(asteroid as Phaser.Physics.Arcade.Sprite);
    }

    damagePlayer(asteroid: Phaser.Physics.Arcade.Sprite) {
        asteroid.play("asteroidExplosion");
        asteroid.setVelocityY(0);
        this.asteroidGroup.remove(asteroid);

        asteroid.on(
            "animationcomplete",
            () => {
                this.asteroidGroup.add(asteroid);
                asteroid.destroy(true);
            },
            asteroid.removeListener("animationcomplete")
        );
        const hp = this.ship.health / 10;
        this.player.takeDamage(hp);
    }

    private showEndMenu = () => {
        const { height } = this.game.canvas;
        this.container.setVisible(true);
        this.tweens.add({
            targets: this.container,
            y: height / 2,
            duration: 600,
            ease: "Elastic",
            easeParams: [1.5, 0.5],
        });
    };
}
