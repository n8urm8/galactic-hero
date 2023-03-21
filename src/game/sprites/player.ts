import Phaser from "phaser";
import { Bullets } from "./bullet";

export default class Player extends Phaser.Physics.Arcade.Sprite {

    private bullets: Bullets;
    private shootTimer: number = 0;
    private shootDelay: number;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame)
        this.bullets = new Bullets(scene, 100, -300)
        this.shootDelay = 300;
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);
        this.shootTimer += delta;
        if (this.shootTimer > this.shootDelay) {
            this.shootTimer = 0;
            this.bullets.fireBullet(this.x, this.y)
        }
    }
    


}

Phaser.GameObjects.GameObjectFactory.register('player', function(this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number){
    let sprite = new Player(this.scene, x, y, texture, frame)

    this.displayList.add(sprite)
    this.updateList.add(sprite)

    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.STATIC_BODY)
    //sprite.body.setSize(sprite.width, sprite.height)
    sprite.body.setCircle(sprite.width)
    sprite.body.setOffset(-sprite.width/2, -sprite.width/3)


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