import Phaser from "phaser";
import Player from '../sprites/player'
import '../sprites/player'
import { EnemyShip } from "../sprites/enemy";
import { api } from "~/utils/api";
import { EventEmitter } from "~/utils/events";
import { IWaveEnemy } from "~/utils/gameTypes";

// Create wave complete and game over events
// need wave completion scene before going back to game scene

export default class WaveScene extends Phaser.Scene {

    private player!: Player;
    private enemies!: Phaser.GameObjects.Group;
    private enemiesToLoad!: IWaveEnemy[]
    private ship: any;
    private emitter = EventEmitter.getInstance()

    constructor() {
      super("WaveScene");
    }

    init(data: any) {
        // console.log('wavescene data:',data)
        this.enemiesToLoad = data.loadedEnemies
        this.ship = data.player
    }
    
    create() {
        let { width, height } = this.game.canvas;
        const endWaveBtn = this.add.image(62, height-20, 'purpleButton').setInteractive({ useHandCursor: true }).once('pointerdown', () => {
            this.scene.stop()
            this.scene.run('GameScene')
        })
        endWaveBtn.scaleX = 1.2
        this.add.text(endWaveBtn.x, endWaveBtn.y, 'End Wave').setOrigin(0.5)

        // Player
        this.player = this.add.player(
            width/1.5, 
            height/1.2,
            this.ship,
        )
        // Enemy Group
        this.enemies = this.add.group({
            classType: EnemyShip,
            runChildUpdate: true,
        })

        this.enemiesToLoad && this.enemiesToLoad.forEach((enemy: IWaveEnemy) => {
            for (let i=0; i < enemy.amount; i++){
                let newEnemy = this.enemies.add(new EnemyShip(this, enemy.health, enemy.startX[i]!, enemy.startY, enemy.sprite, enemy.velocity, enemy.bulletRange, enemy.shootDelay, enemy.bulletSpeed, enemy.bulletDamage, this.player))
                this.physics.add.collider(newEnemy, this.player.getBullets(), this.player.damageEnemy)
            }
        })

    } 
    
    update(time: number, delta: number) {
        //super.update(time, delta);
        let timer = 0
        timer += delta
        if(timer <= 300) {
            let target = this.findClosestEnemy()
            //console.log('player in update:', this.player)
            target && this.player.setEnemy(target)
            timer = 0
        }
        this.findClosestEnemy() && this.player.update(time, delta)
        
        if (this.player.getCurrentHP() <= 0) {
            console.log('looooossssseeerrrrr')
            this.endWave(false)
        }

        if (this.enemies.getMatching('visible', true).length == 0) {
            console.log('enemy scum terminated!')
            this.endWave(true)
        }

    }
    
    findClosestEnemy = () => {
        let enemyUnits = this.enemies.getChildren();
        //console.log('targeting enemy!!!', this.enemies)
        let player = this.player
        for(let i = 0; i < enemyUnits.length; i++) {   
            let enemy = enemyUnits[i] as Phaser.Physics.Arcade.Sprite
            //console.log('enemy, player', enemy , player, player.getBulletRange())
            if(enemy.active && Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y) < player.getBulletRange())
                //console.log('returned enemy', enemy as EnemyShip)
                return enemy as EnemyShip;
        }
        return false;
    }

    endWave = (completed: boolean) => {
        let condition = completed ? 'VICTORY' : 'DEFEAT'
        this.scene.start('EndWaveScene', { condition: condition, ship: this.ship })
        this.scene.stop()
    }    
    
  }