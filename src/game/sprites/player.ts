import Phaser, { Physics } from "phaser";
import { HealthBar } from "../objects/healthBar";
import { Bullets } from "./bullet";
import { EnemyShip } from "./enemy";

export default class Player extends Phaser.Physics.Arcade.Sprite {

    private bullets: Bullets;
    private shootTimer: number = 0;
    private shootDelay: number;
    private bulletRange: number;
    private health: number;
    private bulletDamage: number;
    private shield: number; // reduces damage by shield/1000
    private enemy?: EnemyShip;
    private healthBar: HealthBar
    private baseHP: number;
    private baseBulletDamage: number;
    private baseBulletRange: number;
    private baseBulletSpeed: number;
    private baseShield: number;
    private baseShootDelay: number;
    private level: number;

    constructor(scene: Phaser.Scene, 
        x: number, 
        y: number, 
        texture: string, 
        baseHP: number,
        baseBulletDamage: number,
        baseBulletRange: number,
        baseBulletSpeed: number,
        baseShield: number,
        baseShootDelay: number,
        level: number,
        frame?: string | number
    ) {
        super(scene, x, y, texture, frame)
        // base stats
        this.baseHP = baseHP
        this.baseBulletDamage = baseBulletDamage
        this.baseBulletRange = baseBulletRange
        this.baseBulletSpeed = baseBulletSpeed
        this.baseShield = baseShield
        this.baseShootDelay = baseShootDelay
        this.level = level
        // stats after level bonus (1%/lvl)
        this.health = baseHP * (1 + (level / 100))
        this.bulletDamage = baseBulletDamage * (1 + (level / 100))
        // need to adjust stats for equipment bonuses
        //console.log('player base stats:', baseHP, baseBulletDamage, baseBulletRange, baseBulletSpeed, baseShield, baseShootDelay, level)
        this.bulletRange = baseBulletRange
        this.shield = baseShield
        this.shootDelay = baseShootDelay

        //console.log('ship stats:', this.bulletDamage, this.bulletRange, this.shootDelay)
        this.bullets = new Bullets(scene, 'bullet5', 100, baseBulletSpeed)
        this.healthBar = new HealthBar(scene, x-40, y+55, this.health)
    }

    create() {

    }

    update = (time: number, delta: number) => {
        //super.update(time, delta);
        //console.log(this.shootTimer)
        this.shootTimer += delta;
        if (this.shootTimer > this.shootDelay) {
            //console.log('enemy:', this.enemy)
            this.shootTimer = 0;
            this.bullets.fireBullet(this, this.enemy!.x, this.enemy!.y+10, true)
        }
    }
    
    setEnemy(enemy: EnemyShip) {
        this.enemy = enemy
        //console.log('!!Enemy Set!!')
    }
    
    damageEnemy = (obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) => {  
        this.bullets.killAndHide(obj2)
        // calculate damage to enemy
        this.enemy?.takeDamage(this.bulletDamage)
    }

    takeDamage = (power: number) => {
        let damage = power - (power * this.shield / 1000)
        this.health -= damage
        this.healthBar.decrease(damage)
        if (this.health <= 0){
          this.disableBody(true, true)
        }
        //console.log('Player has taken damage', this.health)

      }

    getBulletRange() {
        return this.bulletRange
    }

    getBullets = () => {
        return this.bullets
    }

    getCurrentEnemy() {
        return this.enemy
    }

    getCurrentHP = () => {
        return this.health
    }
}

Phaser.GameObjects.GameObjectFactory.register('player', function(this: Phaser.GameObjects.GameObjectFactory, 
    x: number, 
    y: number, 
    texture: string,
    baseHP: number,
    baseBulletDamage: number,
    baseBulletRange: number,
    baseBulletSpeed: number,
    baseShield: number,
    baseShootDelay: number,
    level: number,
    frame?: string | number){
    let sprite = new Player(this.scene, 
        x, 
        y,
        texture,
        baseHP,
        baseBulletDamage,
        baseBulletRange,
        baseBulletSpeed,
        baseShield, 
        baseShootDelay,
        level,
        frame
    )
    
    this.displayList.add(sprite)
    this.updateList.add(sprite)

    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.STATIC_BODY)
    sprite.displayWidth = 75
    sprite.scaleY = sprite.scaleX
    sprite.body.setCircle(sprite.displayWidth/1.5)
    sprite.body.setOffset(sprite.displayWidth/6, sprite.displayWidth/3)

    return sprite
})

declare global
{
	namespace Phaser.GameObjects
	{
		interface GameObjectFactory
		{
			player(    
                x: number, 
                y: number, 
                texture: string,
                baseHP: number,
                baseBulletDamage: number,
                baseBulletRange: number,
                baseBulletSpeed: number,
                baseShield: number,
                baseShootDelay: number,
                level: number,
                frame?: string | number
                ): Player
		}
	}
}