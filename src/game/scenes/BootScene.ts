import Phaser from "phaser";
import { EventEmitter, GameEvents } from "~/utils/events";
import { PlayerWithInventory } from "~/utils/gameTypes";
import { PlayerShipSprites } from "~/utils/ships";

// LOAD PLAYER DATA HERE

export default class BootScene extends Phaser.Scene {
    private emitter = EventEmitter.getInstance();
    private profile!: PlayerWithInventory;

    constructor() {
        super("BootScene");
    }

    preload() {
        this.emitter.on(GameEvents.profileLoaded, this.loadProfile);
        this.emitter.emit(GameEvents.getProfile);
        this.load.image("starsBackground", "static/images/Stars.png");
        this.load.image("nebulaBackground", "static/images/Nebula3.png");
        this.load.image("purpleButton", "static/images/ui/purpleButton.png");
        this.load.image("goldSquare", "static/images/ui/goldSquare.png");
        this.load.image("creditsIcon", "static/images/ui/creditsIcon.png");
        this.load.image("menuSlot", "static/images/ui/menuSlot.png");
        // this.load.spritesheet("uiStatic", "static/images/ui/uiAssets.png", {
        //     frameWidth: 16,
        //     frameHeight: 16,
        // });
        this.load.spritesheet(
            "explosion",
            "static/images/effects/explosion.png",
            { frameWidth: 32, frameHeight: 32 }
        );
        this.load.image(
            PlayerShipSprites.base,
            "static/images/ships/player/1B.png"
        );
        this.load.image("bullet5", "static/images/bullets/bullet5.png");
        this.load.image("bullet5e", "static/images/bullets/bullet5e.png");

        this.load.image("enemyTank", "static/images/ships/enemy/2.png");
        this.load.image("enemyNormal", "static/images/ships/enemy/3.png");
        this.load.image("enemyElite", "static/images/ships/enemy/4.png");

        // this.load.image("Offensive", "static/images/equipment/weapon1.png");
        // this.load.image("Defensive", "static/images/equipment/defensive1.png");
        // this.load.image("Utility", "static/images/equipment/utility1.png");

        this.load.bitmapFont(
            "arcade",
            "static/fonts/arcade.png",
            "static/fonts/arcade.xml"
        );

        // this.load.audio('firebullet', "static/sounds/blaster.mp3");
        // this.load.audio('explode', "static/sounds/explode1.wav");
    }

    create() {
        //this.scale.resize(Math.min(window.innerWidth, gameWidth), Math.min(window.innerHeight, gameHeight))
        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("explosion", {
                start: 0,
                end: 5,
            }),
            frameRate: 8,
        });
        this.scene.start("GameScene", this.profile);
    }

    loadProfile = (data: PlayerWithInventory) => {
        this.profile = data;
    };
}
