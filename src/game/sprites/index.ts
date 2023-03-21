import { config } from "../config";
import Phaser from "phaser";

const WIDTH = config.width;
const HEIGHT = config.height;

export class Player extends Phaser.Physics.Arcade.Sprite {

    private speed;
    private currentWeapon;
    private energy;
    private cursorKeys;
    private spacebar;
    private return;

    constructor(scene, x, y) {
      super(scene, x, y, 'player');
      this.scene = scene;
      scene.add.existing(this);
      scene.physics.add.existing(this);
      this.setCollideWorldBounds(true);
      this.speed = 300;
      this.currentWeapon = 0;
      this.energy = 100;
      this.cursorKeys = this.scene.input.keyboard.createCursorKeys();
      this.spacebar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.return = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }
    
    preUpdate(time: number, delta: number) {
      super.preUpdate(time, delta);
      this.handleInput();
    }
    
    handleInput() {
      this.body.velocity.set(0);
      if (this.cursorKeys.left.isDown) {
        this.setVelocityX(-this.speed);
      } else if (this.cursorKeys.right.isDown) {
        this.setVelocityX(this.speed);
      }
  
      if (this.cursorKeys.up.isDown) {
        this.setVelocityY(-this.speed);
      } else if (this.cursorKeys.down.isDown) {
        this.setVelocityY(this.speed);
      }
      
      if (this.spacebar.isDown) {  
        
        this.scene.weapons[this.currentWeapon].fireLaser(this, this.scene.playerBullets);
      }
      
      if (Phaser.Input.Keyboard.JustDown(this.return)) {
        this.nextWeapon()
      }
    }
  
    nextWeapon() {  
      //  Activate the new one
      this.currentWeapon++;
      if (this.currentWeapon === this.scene.weapons.length) {          
        this.currentWeapon = 0; 
      }         
      this.scene.weaponName.text = this.scene.weapons[this.currentWeapon].name;
    }
    
  }
  
  class Baddie1Group extends Phaser.Physics.Arcade.Group {
    constructor (scene) {
      super(scene.physics.world, scene);
      // initialise the group
      this.createMultiple({
        classType: Baddie1,
        key: 'baddie1', // this is always required
        frameQuantity: 5,
        active: false,
        visible:false,
      });
      this.launchTimer;
      this.launchDelay = 1000;
    }
  
    launchEnemy() {
      const enemy = this.getFirstDead(false);
      if (enemy) {
        const startY = Phaser.Math.Between(0, HEIGHT);
        enemy.enableBody(true, WIDTH + enemy.displayWidth, startY, true, true)
        enemy.body.velocity.y = startY > HEIGHT/2 ? Phaser.Math.Between(-200, 0) : Phaser.Math.Between(0, 200);
        enemy.body.velocity.x = -Phaser.Math.Between(Baddie1.SPEED-50, Baddie1.SPEED+50);        
        enemy.body.setDragY(50); // if useDamping is false, this is the absolute draft in pixels per second
      }
      this.launcher = this.scene.time.delayedCall(Phaser.Math.Between(this.launchDelay, this.launchDelay + 1000), this.launchEnemy, [], this);
    }
    
    removeAll() {
      this.children.each(function (item, index) {
        item.remove();
      });
    }
    
  }
  
  class Baddie1 extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
      super(scene, x, y, 'baddie1');
      this.scene = scene;
      scene.add.existing(this);
      scene.physics.add.existing(this);
      this.points = 10;
      this.shootTimer = 0;
    }
    
    static SPEED = 250;
    static SHOOT_DELAY = 1000;
    
    preUpdate(time, delta) {
      super.preUpdate(time, delta);    
    this.shootTimer += delta;
      if (this.shootTimer > Baddie1.SHOOT_DELAY) {
        this.shootTimer = 0;
        this.shoot();
      }
      //  Kill enemies once they go off screen
      if (this.x < 0) {
        this.x = WIDTH + this.displayWidth;
        this.remove();
      }
    }
    
    remove() {
      this.disableBody(true, true)
    }
   
    shoot() {
      const bullet = this.scene.enemyBullets.getFirstDead(false);
      if (bullet) {
        bullet.fire({x: this.x-10, y: this.y+10, angle: 180, speed: 400})
      }
    }
  }
  
  class Baddie2Group extends Phaser.Physics.Arcade.Group {
    constructor (scene) {
      super(scene.physics.world, scene);
      // initialise the group
      this.createMultiple({
        classType: Baddie2,
        key: 'baddie2', // this is always required
        frameQuantity: 20,
        active: false,
        visible:false,
      });
      this.launchTimer;
      this.launchDelay = 5000;
      this.enemiesInSquadron = 5;
      this.squadronSpacing = 100;
      this.squadronSpacing = 50;
    }
  
    launchEnemy() {
      const startingY = Phaser.Math.Between(100, HEIGHT - 100);
      for (let i =0; i < this.enemiesInSquadron; i++) {
        const enemy = this.getFirstDead(false);
        if (enemy) {
          enemy.startingY = startingY;
          const startingX = WIDTH + this.squadronSpacing * i;
          enemy.enableBody(true, startingX, startingY, true, true);
          enemy.body.velocity.x = -Baddie2.SPEED;
          enemy.body.velocity.y = Phaser.Math.Between(-300, 300);
        }
      }
      this.launcher = this.scene.time.delayedCall(Phaser.Math.Between(this.launchDelay, this.launchDelay + 1000), this.launchEnemy, [], this);
    }
     
    removeAll() {
      this.children.each(function (item, index) {
        item.remove();
      });
    }
  
  }
  
  class Baddie2 extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
      super(scene, x, y, 'baddie2');
      this.scene = scene;
      scene.add.existing(this);
      scene.physics.add.existing(this);
      this.points = 50;
      this.startingY;
      this.wave = {amplitude: 60, frequency: 70}
  
    };
  
    static SPEED = 250;
    
  
    preUpdate(time, delta) {
      super.preUpdate(time, delta);    
      this.y = this.startingY + Math.sin((this.x) / this.wave.frequency) * this.wave.amplitude;
      //  Kill enemies once they go off screen
      if (this.x < 0) {
        this.x = WIDTH + this.displayWidth;
        this.remove(); 
      }
    }
  
    remove() {
      this.disableBody(true, true)
    }
  
  
  }
  
  class Baddie3Group extends Phaser.Physics.Arcade.Group {
    constructor (scene) {
      super(scene.physics.world, scene);
      // initialise the group
      this.createMultiple({
        classType: Baddie3,
        key: 'baddie3', // this is always required
        frameQuantity: 5,
        active: false,
        visible:false,
      });
      this.launchTimer;
      this.launchDelay = 1000;
    }
  
    launchEnemy() {
      const enemy = this.getFirstDead(false);
      if (enemy) {
        const startY = Phaser.Math.Between(0, HEIGHT);
        enemy.enableBody(true, WIDTH + enemy.displayWidth, startY, true, true)
        enemy.body.velocity.y = startY > HEIGHT/2 ? Phaser.Math.Between(-200, 0) : Phaser.Math.Between(0, 200);
        enemy.body.velocity.x = -Phaser.Math.Between(Baddie3.SPEED - 50, Baddie3.SPEED + 50);          
        enemy.body.setDragY(50); // if useDamping is false, this is the absolute draft in pixels per second
      }
      this.launcher = this.scene.time.delayedCall(Phaser.Math.Between(this.launchDelay, this.launchDelay + 1000), this.launchEnemy, [], this);
    }
     
    removeAll() {
      this.children.each(function (item, index) {
        item.remove();
      });
    }
  
  }
  
export class Baddie3 extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
      super(scene, x, y, 'baddie3');
      this.scene = scene;
      scene.add.existing(this);
      scene.physics.add.existing(this);
      this.points = 100;
      this.rotateTween = scene.tweens.add({
        targets: this,
        scaleY: 0.1,
        duration: 1000,
        yoyo: true,
        repeat: -1
      });
      this.shootTimer = 0;
    } 
    static SPEED = 200;
    static SHOOT_DELAY = 1000;
    
    preUpdate(time, delta) {
      super.preUpdate(time, delta);    
      this.shootTimer += delta;
      if (this.shootTimer > Baddie3.SHOOT_DELAY && this.x > 300) {
        this.shootTimer = 0;
        this.shoot();
      }
      //  Kill enemies once they go off screen
      if (this.x < 0) {
        this.x = WIDTH + this.displayWidth;
        this.remove();  
      }
    }
  
    shoot() {
      const bullet = this.scene.enemyBullets.getFirstDead(false);
      if (bullet) {
        bullet.fire({x: this.x, y: this.y, angle: 180, speed: 300, texture: 'baddieBullet', target: this.scene.player})
      }
  
    }
    
    remove() {
      this.disableBody(true, true)
    }  
  }