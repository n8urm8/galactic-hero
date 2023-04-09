import Phaser from "phaser";
import Player from '../sprites/player'
import '../sprites/player'
import { EnemyShip } from "../sprites/enemy";
import { api } from "~/utils/api";
import { EventEmitter, GameEvents } from "~/utils/events";
import { IWaveEnemy } from "~/utils/gameTypes";
import { getTankEnemy, getNormalEnemy, getEliteEnemy } from "~/utils/enemies";

// Create wave complete and game over events
// need wave completion scene before going back to game scene

export default class EndWaveScene extends Phaser.Scene {

    private emitter = EventEmitter.getInstance()
    private condition = 'DEFEAT'
    private timer = 200
    private timerText!: Phaser.GameObjects.Text
    private ship: any

    constructor() {
      super("EndWaveScene");
    }

    init(data: any) {
        this.condition = data.condition
        this.ship = data.ship
    }
    
    create() {
        if (this.condition == 'VICTORY') {
            //console.log('waveCompleted event')
            this.emitter.emit(GameEvents.waveCompleted)
            //this.emitter.emit(GameEvents.getProfile)
        }
        let { width, height } = this.game.canvas;
        let container = this.add.container(width/2, height/2.5)
        let endWaveModal = this.add.image(0, 0, 'goldSquare')
        endWaveModal.scaleX = 1.5
        const endWaveBtn = this.add.image(0, +40, 'purpleButton').setInteractive({ useHandCursor: true }).once('pointerdown', () => {
            this.endWave()
        })
        endWaveBtn.scaleX = 1.2
        let btnText = this.add.text(endWaveBtn.x, endWaveBtn.y, 'Retreat').setOrigin(0.5)
        let conditionText = this.add.text(endWaveModal.x, endWaveModal.y-30, this.condition, {
			fontSize: '40px',
			color: '#fff',
			shadow: { fill: true, blur: 5, color: '#000000', offsetY: 2, offsetX: 2 }
		}).setOrigin(0.5)
        this.timerText = this.add.text(endWaveModal.x, endWaveModal.y, this.formatTimer(this.timer)).setVisible(this.condition == 'VICTORY').setOrigin(0.5)


        container.add(endWaveModal)
        container.add(endWaveBtn)
        container.add(conditionText)
        container.add(btnText)
        container.add(this.timerText)

        this.tweens.add({
            targets: container,
            y: height/2,
            duration: 600,
            ease: 'Elastic',
            easeParams: [1.5, .5]
        })
    } 
    
    update(time: number, delta: number) {
        let width = this.game.canvas.width
        if (this.condition == 'VICTORY' && this.timer > 0) {
            this.timer--
            this.timerText.setText(this.formatTimer(this.timer))
            this.timer == 0 && this.loadNextWave(width)
        }

    }

    endWave = () => {
        this.scene.stop()
        this.scene.run('GameScene')
    }

    formatTimer = (ms: number) => {
        let seconds = Math.floor(ms/100)
        let remainder = ms%100

        return `${seconds}:${remainder}`
    }

    loadNextWave = (width: number, wave?: number) => {
        let enemiesToLoad = [getTankEnemy(width), getNormalEnemy(width), getEliteEnemy(width)]
        this.timer = 200
        this.scene.stop()
        //console.log('next wave data', enemiesToLoad)
        this.scene.run('WaveScene', {loadedEnemies: enemiesToLoad, player: this.ship})
    }
    
  }