import Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
    constructor() {
      super('BootScene');
    }
  
    preload(){
        this.load.image('starsBackground', 'assets/images/Stars.png')
        this.load.image('nebulaBackground', 'assets/images/Nebula3.png')
        this.load.image('player', 'assets/images/ships/1B.png');
        for (let i = 1; i <= 11; i++) {
            this.load.image('bullet' + i, 'assets/images/bullets/bullet' + i + '.png') 
        };
        this.load.image('baddie1', 'assets/images/ships/2.png');
        
        this.load.bitmapFont('arcade', 'assets/fonts/arcade.png', 'assets/fonts/arcade.xml');
    
        this.load.audio('firebullet', "assets/sounds/blaster.mp3");
        this.load.audio('explode', "assets/sounds/explode1.wav");      
   
    }
    
    create() {
        
        this.scene.start("GameScene");
    }
  
  }

