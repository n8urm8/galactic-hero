import Phaser from "phaser";
import { gameHeight, gameWidth } from "~/pages/game";
import { EventEmitter, GameEvents } from "~/utils/events";
import { PlayerShipSprites } from "~/utils/ships";

// LOAD PLAYER DATA HERE

export default class BootScene extends Phaser.Scene {

    private emitter = EventEmitter.getInstance();
    private profile: any;
    
    constructor() {
      super('BootScene');

    }
  
    preload(){
        this.emitter.on(GameEvents.profileLoaded, this.loadProfile)
        this.emitter.emit(GameEvents.getProfile)
        this.load.image('starsBackground', 'assets/images/Stars.png')
        this.load.image('nebulaBackground', 'assets/images/Nebula3.png')
        this.load.image('purpleButton', 'assets/images/ui/purpleButton.png')
        this.load.image('goldSquare', 'assets/images/ui/goldSquare.png')
        this.load.spritesheet('uiAssets', 'assets/images/ui/uiAssets.png', {frameWidth: 16, frameHeight: 16} )
        this.load.spritesheet('explosion', 'assets/images/effects/explosion.png', {frameWidth: 32, frameHeight: 32} )
        this.load.image(PlayerShipSprites.base, 'assets/images/ships/player/1B.png');
        this.load.image('bullet5', 'assets/images/bullets/bullet5.png') 
        this.load.image('bullet5e', 'assets/images/bullets/bullet5e.png')
        
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
        this.scene.start("GameScene", this.profile);
    }

    loadProfile = (data: any) => {
        this.profile = data
    }
  
  }

