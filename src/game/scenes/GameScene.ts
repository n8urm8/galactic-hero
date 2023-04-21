import Phaser from "phaser";
import '../sprites/player'
import { EventEmitter, GameEvents } from "~/utils/events";
import { IWaveEnemy, PlayerWithInventory } from "~/utils/gameTypes";
import { getTankEnemy, getNormalEnemy, getEliteEnemy } from "~/utils/enemies";
import { PurpleButton } from "../objects/purpleButton";
import { gameWidth, gameHeight } from "~/pages/game";

export default class GameScene extends Phaser.Scene {

    private player!: Phaser.Physics.Arcade.Sprite;
    private enemies!: Phaser.GameObjects.Group;
    private emitter = EventEmitter.getInstance();
    private enemiesToLoad!: IWaveEnemy[]
    private profile!: PlayerWithInventory
    private ship: any
    private creditsText!: Phaser.GameObjects.Text
    private wavesText!: Phaser.GameObjects.Text
    private upgradesOpen = true;
    private startWaveBtn?: Phaser.GameObjects.Image
    private upgradesBtn?: Phaser.GameObjects.Image

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
      this.startWaveBtn = new PurpleButton(this, 62, height-20, 'Start Wave', this.startWave, undefined, 1.2)
      this.upgradesBtn = new PurpleButton(this, 172, height-20, 'Upgrades', this.openUpgradesMenu)
      
      this.add.text(10, 10, `Player: ${this.profile.name}`)
      this.creditsText = this.add.text(10, 25, `Credits: ${this.profile.credits}`)
      this.wavesText = this.add.text(10, 40, `Waves: ${this.profile.waves}`)

      this.scene.run('UpgradeMenuScene', {profileData: this.profile})

    } 
    
    update(time: number, delta: number) {
      this.emitter.on(GameEvents.waveCountUpdated, 
          this.updateProfileWaves, 
          this.emitter.removeListener(GameEvents.waveCountUpdated)
      )
      this.emitter.on(GameEvents.profileLoaded, 
        this.loadProfile,
        this.emitter.removeListener(GameEvents.profileLoaded)
      )
      window.addEventListener('resize', this.resize,)
    }
    
    loadEnemies = (width: number, wave?: number) => {
        this.enemiesToLoad = [getTankEnemy(width), getNormalEnemy(width), getEliteEnemy(width)]
    }
    
    updateProfileWaves = (data: {waves: number}) => {
        //console.log('updating wave count')
        this.profile.waves = data.waves
        this.wavesText.setText(`Waves: ${this.profile.waves}`)
    }

    startWave = () => {
      this.scene.run('WaveScene', { loadedEnemies: this.enemiesToLoad, player: this.ship })
    }

    openUpgradesMenu = () => {
      if (this.upgradesOpen) {
        this.scene.stop('UpgradeMenuScene')
        this.upgradesOpen = false
      } else {
        this.upgradesOpen = true
        this.scene.run('UpgradeMenuScene', {profileData: this.profile})
      }
    }

    loadProfile = (data: PlayerWithInventory) => {
        this.profile = data
        this.creditsText.setText(`Credits: ${this.profile.credits}`)
        this.wavesText.setText(`Waves: ${this.profile.waves}`)
    }

    resize = () => {
      //console.log('resizing', Math.min(window.innerHeight, gameHeight))
      this.scale.resize(Math.min(window.innerWidth, gameWidth), Math.min(window.innerHeight, gameHeight))
    }

  }