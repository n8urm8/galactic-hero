import Phaser, { Physics } from "phaser";
import { HealthBar } from "../objects/healthBar";
import { Bullets } from "./bullet";
import { EnemyShip } from "./enemy";

interface IPlayer {
    takeDamage: (power: number) => void
}

export default class Player extends Phaser.Physics.Arcade.Sprite {

    private bullets: Bullets;
    private shootTimer: number = 0;
    private shootDelay: number;
    private bulletRange: number = 600;
    private health = 1000;
    private enemy?: EnemyShip;
    private healthBar: HealthBar

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame)
        this.bullets = new Bullets(scene, 100, 300)
        this.shootDelay = 300;
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
        this.scene.physics.add.collider(this.enemy, this.bullets, this.damageEnemy)
        //console.log('!!Enemy Set!!')
    }
    
    damageEnemy = (obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) => {  
        this.bullets.killAndHide(obj2)
        // calculate damage to enemy
        this.enemy?.takeDamage(10)
    }

    takeDamage = (power: number) => {
        this.health -= power
        this.healthBar.decrease(power)
        if (this.health <= 0){
          this.disableBody(true, true)
        }
        //console.log('Player has taken damage', this.health)

      }

    getBulletRange() {
        return this.bulletRange
    }

    getCurrentEnemy() {
        return this.enemy
    }

    updateHealth = () => {

    }
}

Phaser.GameObjects.GameObjectFactory.register('player', function(this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number){
    let sprite = new Player(this.scene, x, y, texture, frame)
    let { width } = this.scene.game.canvas

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
			player(x: number, y: number, texture: string, frame?: string | number): Player
		}
	}
}