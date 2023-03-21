import Phaser from "phaser";

const HEIGHT = 640
const WIDTH = 800

// export class Baddie1Group extends Phaser.Physics.Arcade.Group {
//     constructor (scene: Phaser.Scene) {
//       super(scene.physics.world, scene);
//       // initialise the group
//       this.createMultiple({
//         classType: Baddie1,
//         key: 'baddie1', // this is always required
//         frameQuantity: 5,
//         active: false,
//         visible:false,
//       });
//       this.launchTimer;
//       this.launchDelay = 1000;
//     }
  
//     launchEnemy() {
//       const enemy = this.getFirstDead(false);
//       if (enemy) {
//         const startY = Phaser.Math.Between(0, HEIGHT);
//         enemy.enableBody(true, WIDTH + enemy.displayWidth, startY, true, true)
//         enemy.body.velocity.y = startY > HEIGHT/2 ? Phaser.Math.Between(-200, 0) : Phaser.Math.Between(0, 200);
//         enemy.body.velocity.x = -Phaser.Math.Between(Baddie1.SPEED-50, Baddie1.SPEED+50);        
//         enemy.body.setDragY(50); // if useDamping is false, this is the absolute draft in pixels per second
//       }
//       this.launcher = this.scene.time.delayedCall(Phaser.Math.Between(this.launchDelay, this.launchDelay + 1000), this.launchEnemy, [], this);
//     }
    
//     removeAll() {
//       this.children.each(function (item, index) {
//         item.remove();
//       });
//     }

// }
  
export class EnemyShip extends Phaser.Physics.Arcade.Sprite {

    private shootTimer: number;
    private targetX: number;
    private targetY: number;
    private bulletRange: number;

    constructor(scene: Phaser.Scene, 
        startX: number, 
        startY: number, 
        sprite: string,
        velocity: number,
        bulletRange: number,
        targetX: number,
        targetY: number,) {
      super(scene, startX, startY, sprite );
      this.scene = scene;
      scene.add.existing(this);
      scene.physics.add.existing(this);
      //this.points = 10;
      this.shootTimer = 0;
      this.setScale(.25, .25)
      this.setVelocityY(velocity)
      this.targetX = targetX;
      this.targetY = targetY;
      this.bulletRange = bulletRange;
      console.log(targetX, targetY)
    }
    
    static SPEED = 250;
    static SHOOT_DELAY = 1000;
    
    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta); 
        
 

        this.shootTimer += delta;
        if (this.shootTimer > EnemyShip.SHOOT_DELAY) {
            this.shootTimer = 0;
            this.shoot();
        }
        //  Kill enemies once they go off screen
  
    }
    // 400 533
    // 200 310| 300 252 | 400 235 | 500 252 | 600 310
    update(time: number, delta: number) {
       // stop when in shooting range of target
       if(Phaser.Math.Distance.Between(this.x, this.y, this.targetX, this.targetY) < this.bulletRange) {
            this.setVelocityY(0)
            let rotation: number;
            if (this.x < this.targetX) {
                //console.log('less than',this.targetX, this.targetY, this.x, this.y)
                rotation = Phaser.Math.Angle.Between(this.y, this.x, this.targetY, this.targetX) * -1
            } else if (this.x > this.targetX) {
                //console.log('greater than',this.targetX, this.targetY, this.x, this.y)
                rotation = Phaser.Math.Angle.Between(this.y, this.x, this.targetY, this.targetX) * -1
            } else {
                rotation = 0
            }

            //console.log('ship:', this.x, this.y)
            //const rotation = angle(this.targetX, this.targetY, this.x, this.y)
            // //console.log(Phaser.Math.Angle.Between(this.targetX, this.targetY, this.x, this.y, ))
            // const vector = new Phaser.Math.Vector2(this.targetX - this.x, this.targetY - this.y)
            // const rotation = Phaser.Math.Angle.Between(this.targetX, this.x, this.targetY, this.y)
            // //console.log(rotation, vector.angle())
            this.setRotation(rotation)

        }
    }
    
    remove() {
      this.disableBody(true, true)
      
    }
   
    shoot() {
   
    }
  }

  function angle(cx:number, cy:number, ex:number, ey:number) {
    var dy = ey - cy;
    var dx = ex - cx;
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    //if (theta < 0) theta = 360 + theta; // range [0, 360)
    return theta;
  }