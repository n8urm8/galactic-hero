import Phaser from "phaser";
import Player from '../sprites/player'
import '../sprites/player'
import { EnemyShip } from "../sprites/enemy";
import { EventEmitter } from "~/utils/events";
import { IWaveEnemy } from "~/utils/enemies";

export default class GameScene extends Phaser.Scene {

    private player!: Phaser.Physics.Arcade.Sprite;
    private enemies!: Phaser.GameObjects.Group;
    private emitter=EventEmitter.getInstance();
    private enemiesToLoad!: IWaveEnemy[]

    constructor() {
      super("GameScene");
    }
    
    create() {
        let { width, height } = this.game.canvas;
        this.emitter.on('enemyLoaded', this.loadEnemies, this)

        this.add.image(width/2, height/2, 'nebulaBackground');
        this.add.image(width/2, height/2, 'starsBackground');
        // ui
        const startWaveBtn = this.add.image(62, height-20, 'purpleButton').setInteractive({ useHandCursor: true }).once('pointerdown', () => {
            //console.log('clicked start wave!')
            this.emitter.emit('startWave', { width })
            this.scene.run('WaveScene', { loadedEnemies: this.enemiesToLoad })
        })
        startWaveBtn.scaleX = 1.2
        this.add.text(startWaveBtn.x, startWaveBtn.y, 'Start Wave').setOrigin(0.5)


    } 
    
    update(time: number, delta: number) {
        
    }
    
    loadEnemies = (data: any) => {
        //console.log('loadEnemies: ', data)
        this.enemiesToLoad = data
    }

    public getEnemies = () => {
      return  
    }
    
  }