import Phaser, { GameObjects } from "phaser";
import Player from "../sprites/player";
import "../sprites/player";
import { EnemyShip } from "../sprites/enemy";
import { api } from "~/utils/api";
import { EventEmitter, GameEvents } from "~/utils/events";
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

    captionTextFormat = `Total:    %1
    Max:      %2
    Active:   %3
    Inactive: %4
    Used:     %5
    Free:     %6
    Full:     %7`;

    captionStyle = {
        fill: "#7fdbff",
        fontFamily: "monospace",
        lineSpacing: 4,
    };

    caption;

    constructor() {
        super("VanguardScene");
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
        this.player.setVanguard();
        // asteroids Group
        this.asteroidGroup = this.add.group({
            defaultKey: "asteroid",
            maxSize: 100,
        });
        this.time.addEvent({
            delay: 500,
            loop: true,
            callback: () => this.addAsteroid(),
        });

        const bossStats = getVanguardBoss(width, this.level);
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
        this.caption = this.add.text(16, 16, "", this.captionStyle);
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

        Phaser.Actions.IncY(this.asteroidGroup.getChildren(), 1);

        this.asteroidGroup.children.iterate((asteroid) => {
            const a1 = asteroid as Phaser.GameObjects.Sprite;
            if (a1.y > 600) {
                this.asteroidGroup.killAndHide(asteroid);
            }
            a1.angle += 1;
        });

        this.caption.setText(
            Phaser.Utils.String.Format(this.captionTextFormat, [
                this.asteroidGroup.getLength(),
                this.asteroidGroup.maxSize,
                this.asteroidGroup.countActive(true),
                this.asteroidGroup.countActive(false),
                this.asteroidGroup.getTotalUsed(),
                this.asteroidGroup.getTotalFree(),
                this.asteroidGroup.isFull(),
            ])
        );

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
        this.scene.stop();
        this.scene.run("GameScene");
        // this.scene.start("EndWaveScene", {
        //     condition: condition,
        //     ship: this.ship,
        //     wave: this.wave,
        // });
    };

    activateAsteroid(asteroid: Phaser.GameObjects.Sprite) {
        asteroid.setActive(true).setVisible(true);
        this.physics.add.existing(asteroid);
        const newScale = Phaser.Math.FloatBetween(0.5, 1.5);
        asteroid.setScale(newScale);
        //.setTint(Phaser.Display.Color.RandomRGB().color);
        //.play("creep");

        this.physics.add.collider(asteroid, this.player, () =>
            this.damagePlayer(asteroid)
        );
    }

    addAsteroid() {
        const { width } = this.game.canvas;
        // Random position above screen
        const x = Phaser.Math.Between(0, width);
        const y = Phaser.Math.Between(-64, 0);

        // Find first inactive sprite in group or add new sprite, and set position
        const asteroid: Phaser.GameObjects.Sprite = this.asteroidGroup.get(
            x,
            y
        );

        // None free or already at maximum amount of sprites in group
        if (!asteroid) {
            return;
        }

        this.activateAsteroid(asteroid);
    }

    damagePlayer(asteroid: Phaser.GameObjects.Sprite) {
        //asteroid.play("asteroidExplosion");
        this.anims.play("asteroidExplosion", asteroid);
        this.asteroidGroup.killAndHide(asteroid);
        //asteroid.destroy();
        const hp = this.ship.health / 10;
        this.player.takeDamage(100);
    }
}
