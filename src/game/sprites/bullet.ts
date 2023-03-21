import Phaser from "phaser";

const HEIGHT = 640
const WIDTH = 800

export class Bullet extends Phaser.Physics.Arcade.Sprite {


	constructor(scene: Phaser.Scene, x: number, y: number, sprite: string, frame?: string | number) {
        super(scene, x, y, sprite, frame)
        //scene.physics.add.existing(this)
	}
    
    fire (x: number, y: number, velocity: number) {
        this.body.reset(x, y);

        this.setActive(true);
        this.setVisible(true);

        this.setVelocityY(velocity);
    }
    
    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);
   
        // if (this.scaleSpeed > 0) {
        //     this.scaleX += this.scaleSpeed;
        //     this.scaleY += this.scaleSpeed;
        // }
        if (this.outOfScreen()) {
            this.remove();
        }
    }

    outOfScreen() {
        return (
            this.y <= 0 || this.y >= HEIGHT 
        );
    }
    
    remove() {
        this.disableBody(true, true)
    }
}

export class Bullets extends Phaser.Physics.Arcade.Group {

    private velocity: number;
    private flip: boolean;

    constructor(scene: Phaser.Scene, maxBullets: number, velocity: number, rotate?: boolean) {
    
        super(scene.physics.world, scene);
        this.createMultiple({
            classType: Bullet,
            key: 'bullet5',
            frameQuantity: maxBullets,
            active: false,
            visible: false,
        });
        this.velocity = velocity
        this.flip = rotate || false;
    }

    fireBullet (x: number, y: number){
        let bullet = this.getFirstDead(false);
        this.flip && bullet.setRotation(180)

        if (bullet)
        {
            bullet.fire(x, y, this.velocity);
        }
    }

}