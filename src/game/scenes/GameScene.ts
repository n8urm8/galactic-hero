import Phaser from "phaser";
import Player from '../sprites/player'
import '../sprites/player'
import { EnemyShip } from "../sprites/enemy";
const HEIGHT = 640
const WIDTH = 800
export default class GameScene extends Phaser.Scene {

    private player?: Phaser.Physics.Arcade.Sprite;
    private enemies?: Phaser.GameObjects.Group;

    constructor() {
      super("GameScene");
      //this.player;
    }
    
    create() {
        this.add.image(200, 200, 'nebulaBackground');
        this.add.image(400, 200, 'starsBackground');
        this.player = this.add.player(WIDTH/2, HEIGHT/1.2, 'player')
        this.enemies = this.add.group({
            classType: EnemyShip,
            runChildUpdate: true,
        })
        for(let i = 0; i < 5; i++) {
            this.enemies.get(WIDTH/4+i*100, -50, 'baddie1')
            this.enemies.add(new EnemyShip(this, WIDTH/4+i*100, -50, 'baddie1', 100, 300, this.player.x, this.player.y ))
        }

    } 
    
    update(time: number, delta: number) {
        
    }
    
    hitEnemy() {

    }
    
    playerHit() {

    }
    
  }