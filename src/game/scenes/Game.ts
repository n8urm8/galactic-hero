import Phaser from "phaser";
import { config } from "../config";

export class GameScene extends Phaser.Scene {

    private background;
    private foreground;
    private player;
    private weapons;    
    private weaponName;
    private score;


    constructor() {
      super("Game");
      this.background = null;
      this.foreground = null;
      this.player = null;
      this.weapons = [];    
      this.weaponName = null;
      this.score = 0;
    }
    
    create() {
      this.add.tileSprite(0, 0, config.width, config.height, 'background').setOrigin(0,0);
      this.player = new Player(this, 64, 200);
      this.baddie1s = new Baddie1Group(this);
      this.baddie2s = new Baddie2Group(this);
      this.baddie3s = new Baddie3Group(this);
      this.foreground = this.add.tileSprite(0, 0, config.width, config.height, 'foreground').setOrigin(0,0);
      this.weaponName = this.add.bitmapText(8, 370, 'arcade', "ENTER = Next Weapon", 16).setCharacterTint(0, -1, true, 0x00aef7);
      this.scoreText = this.add.bitmapText(8, 4, 'arcade', "SCORE:000000", 16).setCharacterTint(0, 13, true, 0x00aef7);
      this.energyText = this.add.bitmapText(450, 4, 'arcade', "ENERGY:"+this.player.energy, 16).setCharacterTint(0, 13, true, 0x00aef7);
      this.playerBullets = new Bullets(this, 100);
      //create weapons and push into array
      this.weapons.push(new SingleBullet(this));
      this.weapons.push(new FrontAndBack(this));
      this.weapons.push(new ThreeWay(this));
      this.weapons.push(new EightWay(this));
      this.weapons.push(new ScatterShot(this));
      this.weapons.push(new Beam(this));
      this.weapons.push(new SplitShot(this));    
      this.weapons.push(new Pattern(this));
      this.weapons.push(new Rockets(this));
      this.weapons.push(new ScaleBullet(this));  
      this.weapons.push(new Combo1(this));
      this.weapons.push(new Combo2(this));
    
      this.baddie1s.launchEnemy();
      this.baddie2s.launchEnemy();
      this.baddie3s.launchEnemy();
      this.enemyBullets = new Bullets(this, 10);
      // create sound objects
      this.shootSFX = this.sound.add('firebullet');
      this.explodeSFX = this.sound.add('explode');
      
      this.explosion = this.add.particles("bullet7").createEmitter({
        scale: { start: 1, end: 5, ease: "Cubic.easeOut" },
        alpha: { start: 1, end: 0, ease: "Cubic.easeIn" },
        lifespan: 500,
        blendMode: 3,
        frequency: -1,
        radial: false
      });
  
      this.physics.add.overlap(this.baddie1s, this.playerBullets, this.hitEnemy, null, this);
      this.physics.add.overlap(this.baddie2s, this.playerBullets, this.hitEnemy, null, this);
      this.physics.add.overlap(this.baddie3s, this.playerBullets, this.hitEnemy, null, this);
      this.physics.add.overlap(this.player, this.enemyBullets, this.playerHit, null, this);
    } // end of create
    
    update(time, delta) {
      this.background.tilePositionX += 0.3;
      this.foreground.tilePositionX += 0.5;
    }
    
    hitEnemy(enemy, bullet) {
      this.score += enemy.points;
      this.scoreText.setText("SCORE:"+Phaser.Utils.String.Pad(this.score, 6, '0', 1));
      enemy.remove();
      const { x, y } = bullet.body.center; // set x and y constants to the bullet's body (for use later)
      bullet.remove();
      
      this.explosion
        .setSpeedX(0.2 * bullet.body.velocity.x)
        .setSpeedY(0.2 * bullet.body.velocity.y)
        .emitParticleAt(x, y);
      this.explodeSFX.play();
    }
    
    playerHit(player, bullet) {
      this.player.energy = this.player.energy > 10 ? this.player.energy-10 : 0;
      this.energyText.setText("ENERGY:"+this.player.energy);
      const { x, y } = bullet.body.center; // set x and y constants to the bullet's body (for use later)
      bullet.remove();
      
      this.explosion
        .setSpeedX(0.2 * bullet.body.velocity.x)
        .setSpeedY(0.2 * bullet.body.velocity.y)
        .emitParticleAt(x, y);
      this.explodeSFX.play();
    }
    
  }