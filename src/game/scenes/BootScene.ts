import Phaser from "phaser";
import { gameHeight, gameWidth } from "~/pages/game";

// LOAD PLAYER DATA HERE

export default class BootScene extends Phaser.Scene {
    constructor() {
      super('BootScene');
    }
  
    preload(){
        this.load.image('starsBackground', 'assets/images/Stars.png')
        this.load.image('nebulaBackground', 'assets/images/Nebula3.png')
        this.load.spritesheet('uiAssets', 'assets/images/ui/uiAssets.png', {frameWidth: 16, frameHeight: 16} )
        this.load.spritesheet('explosion', 'assets/images/effects/explosion.png', {frameWidth: 32, frameHeight: 32} )
        this.load.image('player', 'assets/images/ships/player/1B.png');
        for (let i = 1; i <= 11; i++) {
            this.load.image('bullet' + i, 'assets/images/bullets/bullet' + i + '.png') 
        };
        this.load.image('enemyTank', 'assets/images/ships/enemy/2.png');
        this.load.image('enemyNormal', 'assets/images/ships/enemy/3.png');
        this.load.image('enemyElite', 'assets/images/ships/enemy/4.png');
        
        this.load.bitmapFont('arcade', 'assets/fonts/arcade.png', 'assets/fonts/arcade.xml');
    
        // this.load.audio('firebullet', "assets/sounds/blaster.mp3");
        // this.load.audio('explode', "assets/sounds/explode1.wav");      
   
    }
    
    create() {
        this.scale.resize(window.innerWidth, window.innerHeight)
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 5 }),
            frameRate: 8,
            
        })
        this.scene.start("GameScene");
    }
  
  }

