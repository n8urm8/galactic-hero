import Phaser from "phaser";
import Player from '../sprites/player'
import '../sprites/player'
import { EnemyShip } from "../sprites/enemy";
import { EventEmitter, GameEvents } from "~/utils/events";
import { IWaveEnemy } from "~/utils/gameTypes";
import { Player as IPlayer } from "@prisma/client";
import { getTankEnemy, getNormalEnemy, getEliteEnemy } from "~/utils/enemies";
import UpgradeMenu from "./upgradeMenu";

export default class GameScene extends Phaser.Scene {

    private player!: Phaser.Physics.Arcade.Sprite;
    private enemies!: Phaser.GameObjects.Group;
    private emitter=EventEmitter.getInstance();
    private enemiesToLoad!: IWaveEnemy[]
    private profile: any
    private ship: any
    private creditsText!: Phaser.GameObjects.Text
    private wavesText!: Phaser.GameObjects.Text

    constructor() {
      super("GameScene");
    }

    init(data: any){
      this.profile = data
      for (let i = 0; i < data.ships.length; i++) {
        if (data.ships[i].isCurrent) { this.ship = data.ships[i]}
      }
    }
    
    create() {
      
        let { width, height } = this.game.canvas;
        //this.emitter.addListener('waveCompleted', this.updateProfileWaves)

        this.loadEnemies(width)
        this.add.image(width/2, height/2, 'nebulaBackground');
        this.add.image(width/2, height/2, 'starsBackground');
        // ui
        const startWaveBtn = this.add.image(62, height-20, 'purpleButton').setInteractive({ useHandCursor: true }).once('pointerdown', () => {
            //console.log('clicked start wave!')
            //this.emitter.emit('startWave', { width })
            this.scene.run('WaveScene', { loadedEnemies: this.enemiesToLoad, player: this.ship })
        })
        startWaveBtn.scaleX = 1.2
        this.add.text(startWaveBtn.x, startWaveBtn.y, 'Start Wave').setOrigin(0.5)
        this.add.text(10, 10, `Player: ${this.profile.name}`)
        this.creditsText = this.add.text(10, 25, `Credits: ${this.profile.credits}`)
        this.wavesText = this.add.text(10, 40, `Waves: ${this.profile.waves}`)

        
        const upgradeMenuBtn = this.add.image(172, height-20, 'purpleButton').setInteractive({ useHandCursor: true }).once('pointerdown', () => {
          this.scene.run('UpgradeMenuScene', {profileData: this.profile})
        })
        this.add.text(upgradeMenuBtn.x, upgradeMenuBtn.y, 'Upgrades').setOrigin(0.5)

    } 
    
    update(time: number, delta: number) {
      this.emitter.on(GameEvents.waveCountUpdated, 
          this.updateProfileWaves, 
          this.emitter.removeListener(GameEvents.waveCountUpdated)
      )
    }
    
    loadEnemies = (width: number, wave?: number) => {
        this.enemiesToLoad = [getTankEnemy(width), getNormalEnemy(width), getEliteEnemy(width)]
    }
    
    updateProfileWaves = (data: {waves: number}) => {
        //console.log('updating wave count')
        this.profile.waves = data.waves
        this.wavesText.setText(`Waves: ${this.profile.waves}`)
    }
  }