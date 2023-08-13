import Phaser, { Physics } from "phaser";
import { HealthBar } from "../objects/healthBar";
import { Bullets } from "./bullet";
import { EnemyShip } from "./enemy";
import {
    PlayerEquipment,
    PlayerShip,
    PlayerShipWithEquipment,
} from "~/utils/gameTypes";
import { ShipConstants } from "~/utils/statFormulas";
import { PlayerShipSprites } from "~/utils/ships";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    private bullets: Bullets;
    private shootTimer = 0;
    private shootDelay!: number;
    private bulletRange!: number;
    private health!: number;
    private bulletDamage!: number;
    private bulletSpeed!: number;
    private shield!: number; // reduces damage by shield/1000
    private enemy?: EnemyShip;
    private healthBar: HealthBar;
    private ship: PlayerShip;
    private equipment: PlayerEquipment[] = [];

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        ship: PlayerShip,
        equipment?: PlayerEquipment[],
        frame?: string | number
    ) {
        super(scene, x, y, PlayerShipSprites[ship.rarity], frame);

        this.ship = ship;
        if (equipment) {
            this.equipment = equipment;
        }
        this.updateStats();

        this.bullets = new Bullets(scene, "bullet5", 20, this.bulletSpeed);
        this.healthBar = new HealthBar(scene, x - 40, y + 55, this.health);
    }

    updateStats = () => {
        const shipLvl = this.ship.level;
        this.health =
            this.ship.health + (shipLvl - 1) * ShipConstants.hpPerLevel;
        this.shield =
            this.ship.shield *
            (1 +
                ((shipLvl - 1) * ShipConstants.shieldPerLevel) /
                    ShipConstants.shieldStatDivisor);
        this.bulletDamage =
            this.ship.bulletDamage *
            (1 + (shipLvl - 1) * ShipConstants.damagePerLevel);
        this.shootDelay = this.ship.shootDelay;
        this.bulletSpeed = this.ship.bulletSpeed;
        this.bulletRange = this.ship.bulletRange;
        for (let i = 0; i < this.equipment.length; i++) {
            const equip = this.equipment[i]!;
            const lvl = equip?.level;
            this.health += equip.health * lvl;
            this.shield += equip.shield * lvl;
            this.bulletRange += equip.bulletRange * lvl;
            this.bulletDamage += equip.bulletDamage * lvl;
            this.bulletSpeed += equip.bulletSpeed * lvl;
            this.shootDelay -=
                (equip.shootDelay * lvl) / ShipConstants.shootDelayDivisor;
        }
    };

    //create() {}

    update = (time: number, delta: number) => {
        //super.update(time, delta);
        //console.log(this.shootTimer)
        this.shootTimer += delta;
        if (this.shootTimer > this.shootDelay && this.enemy) {
            //console.log('enemy:', this.enemy)
            this.shootTimer = 0;
            this.bullets.fireBullet(
                this,
                this.enemy.x,
                this.enemy.y + 10,
                true
            );
        }
    };

    setEnemy(enemy: EnemyShip) {
        this.enemy = enemy;
        //console.log('!!Enemy Set!!')
    }

    damageEnemy = (
        obj1: Phaser.GameObjects.GameObject,
        obj2: Phaser.GameObjects.GameObject
    ) => {
        this.bullets.killAndHide(obj2);
        // calculate damage to enemy
        this.enemy?.takeDamage(this.bulletDamage);
    };

    takeDamage = (power: number) => {
        const damage =
            power - (power * this.shield) / ShipConstants.shieldDamageDivisor;
        this.health -= damage;
        this.healthBar.decrease(damage);
        if (this.health <= 0) {
            this.disableBody(true, true);
        }
        //console.log('Player has taken damage', this.health)
    };

    getBulletRange() {
        return this.bulletRange;
    }

    getBullets = () => {
        return this.bullets;
    };

    getCurrentEnemy() {
        return this.enemy;
    }

    getCurrentHP = () => {
        return this.health;
    };
}

Phaser.GameObjects.GameObjectFactory.register(
    "player",
    function (
        this: Phaser.GameObjects.GameObjectFactory,
        x: number,
        y: number,
        ship: PlayerShipWithEquipment,
        equipment?: PlayerEquipment[],
        frame?: string | number
    ) {
        const sprite = new Player(this.scene, x, y, ship, equipment, frame);

        this.displayList.add(sprite);
        this.updateList.add(sprite);

        this.scene.physics.world.enableBody(
            sprite,
            Phaser.Physics.Arcade.STATIC_BODY
        );

        //sprite.scaleY = sprite.scaleX;
        sprite.setScale(75 / sprite.width);
        sprite.refreshBody();

        return sprite;
    }
);

declare global {
    namespace Phaser.GameObjects {
        interface GameObjectFactory {
            player(
                x: number,
                y: number,
                ship: PlayerShip,
                equipment?: PlayerEquipment[],
                frame?: string | number
            ): Player;
        }
    }
}
