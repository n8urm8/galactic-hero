import Phaser from "phaser";

const HEIGHT = 640;
const WIDTH = 800;

export class Bullet extends Phaser.Physics.Arcade.Sprite {
    private direction = 0;
    private xSpeed = 0;
    private ySpeed = 0;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        sprite: string,
        frame?: string | number
    ) {
        super(scene, x, y, sprite, frame);
        scene.physics.add.existing(this);
        const { width } = scene.game.canvas;
        this.displayWidth = width / 100;
        this.displayHeight = this.scaleX;
        this.body.setCircle(this.width);
    }

    fire(
        x: number,
        y: number,
        velocity: number,
        targetX: number,
        targetY: number,
        isPlayer: boolean
    ) {
        this.enableBody(true, x, y, true, true);
        this.direction = Math.atan((targetX - this.x) / (targetY + 5 - this.y));
        if (targetY >= this.y) {
            this.xSpeed = velocity * Math.sin(this.direction);
            this.ySpeed = velocity * Math.cos(this.direction);
            this.direction = -this.direction;
        } else {
            this.xSpeed = -velocity * Math.sin(this.direction);
            this.ySpeed = -velocity * Math.cos(this.direction);
        }

        if (isPlayer) {
            this.rotation = this.direction * -1;
        } else {
            this.rotation = this.direction;
        }
        this.setVelocityY(this.ySpeed);
        this.setVelocityX(this.xSpeed);
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);

        if (this.outOfScreen()) {
            this.remove();
        }
    }

    outOfScreen() {
        return this.y <= 0 || this.y >= HEIGHT;
    }

    remove() {
        this.disableBody(true, true);
    }
}

export class Bullets extends Phaser.Physics.Arcade.Group {
    private velocity: number;

    constructor(
        scene: Phaser.Scene,
        sprite: string,
        maxBullets: number,
        velocity: number
    ) {
        super(scene.physics.world, scene);
        this.createMultiple({
            classType: Bullet,
            key: sprite,
            frameQuantity: maxBullets,
            active: false,
            visible: false,
        });
        this.velocity = velocity;
    }

    fireBullet(
        shooter: Phaser.Physics.Arcade.Sprite,
        targetX: number,
        targetY: number,
        isPlayer: boolean | false
    ) {
        let bullet = this.get();
        let bulletY = shooter.y;
        if (isPlayer) {
            bulletY -= shooter.height / 2.1;
        }

        bullet.fire(
            shooter.x,
            bulletY,
            this.velocity,
            targetX,
            targetY,
            isPlayer
        );
    }
}
