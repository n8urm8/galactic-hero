import Phaser from "phaser";
import Player from '../sprites/player'
import '../sprites/player'
import { EnemyShip } from "../sprites/enemy";

export default class UIScene extends Phaser.Scene {

    private player!: Phaser.Physics.Arcade.Sprite;
    private enemies!: Phaser.GameObjects.Group;

    constructor() {
      super("UIScene");
    }
    
    create() {
        let { width, height } = this.game.canvas;

    } 
    
    update(time: number, delta: number) {
        
    }
    

    
  }