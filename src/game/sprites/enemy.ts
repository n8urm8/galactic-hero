import Phaser from "phaser";
import WaveScene from "../scenes/WaveScene";
import { Bullets } from "./bullet";
import Player from "./player";
  
export class EnemyShip extends Phaser.Physics.Arcade.Sprite {

    private shootTimer: number;
    private bulletRange: number;
    private bullets: Bullets;
    private player!: Player
    private health = 10;
    private shootDelay = 300;
    private bulletSpeed = 100;
    private bulletDamage = 100;
    private explosion: Phaser.Physics.Arcade.Sprite;

    constructor(scene: WaveScene, 
        health: number,
        startX: number, 
        startY: number, 
        sprite: string,
        velocity: number,
        bulletRange: number,
        shootDelay: number,
        bulletSpeed: number,
        bulletDamage: number,
        player: Player) {
      super(scene, startX, startY, sprite )
      this.scene = scene
      let { width, height } = scene.game.canvas;
      scene.add.existing(this)
      scene.physics.add.existing(this)
      this.body.pushable = false
      //this.points = 10
      this.shootTimer = 0
      this.displayWidth = 25
      this.scaleY = this.scaleX
      this.body.setCircle(this.width/2)
      this.setVelocityY(velocity)
      this.bulletRange = bulletRange
      this.shootDelay = shootDelay
      this.bulletSpeed = bulletSpeed
      this.bulletDamage = bulletDamage
      this.bullets = new Bullets(scene, 100, this.bulletSpeed, true) 
      this.player = player
      this.scene.physics.add.collider(this.player, this.bullets, this.damagePlayer)

      //effects
      this.explosion = this.scene.physics.add.sprite(this.x, this.y, 'explosion')
      this.explosion.setVisible(false)
      this.explosion.on('animationcomplete', () => {
        this.explosion.setVisible(false)
      })

    }
  
    update(time: number, delta: number) {
      let targetX = this.player.x
      let targetY = this.player.y
       // stop when in shooting range of target
       if(Phaser.Math.Distance.Between(this.x, this.y, targetX, targetY) < this.bulletRange) {
            this.setVelocityY(0)
            let rotation: number;
            if (this.x < targetX) {
                rotation = Phaser.Math.Angle.Between(this.y, this.x, targetY, targetX) * -1
            } else if (this.x > targetX) {
                rotation = Phaser.Math.Angle.Between(this.y, this.x, targetY, targetX) * -1
            } else {
                rotation = 0
            }

            this.setRotation(rotation)

            this.shootTimer += delta;
            if (this.shootTimer > this.shootDelay) {
                this.shootTimer = 0;
                this.bullets.fireBullet(this, targetX, targetY, false)
            }
            
        }
    }

    setPlayer = (player: Player) => {
      this.player = player
    }

    damagePlayer = (obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) => {
      
      //console.log('damaged player:', this.player)
      this.bullets.killAndHide(obj2)
        // calculate damage to player
      this.player.takeDamage(this.bulletDamage)
      
    }
    
    takeDamage = (power: number) => {
      this.health -= power;
      if (this.health <= 0){
        this.disableBody(true, true)
        this.explosion.setPosition(this.x, this.y)
        this.explosion.setVisible(true)
        this.explosion.play('explode')
      }
      //console.log('enemy hp:', this.health)
    }
   
  }

  // function angle(cx:number, cy:number, ex:number, ey:number) {
  //   var dy = ey - cy;
  //   var dx = ex - cx;
  //   var theta = Math.atan2(dy, dx); // range (-PI, PI]
  //   theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  //   //if (theta < 0) theta = 360 + theta; // range [0, 360)
  //   return theta;
  // }