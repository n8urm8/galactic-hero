import Phaser from "phaser";
import { EventEmitter, GameEvents } from "~/utils/events";
import { PlayerWithInventory } from "~/utils/gameTypes";
import { PlayerShipSprites } from "~/utils/ships";
import { spriteSelector } from "~/utils/spritePaths";

// LOAD PLAYER DATA HERE

export default class BootScene extends Phaser.Scene {
    private emitter = EventEmitter.getInstance();
    private profile!: PlayerWithInventory;

    constructor() {
        super("BootScene");
    }

    preload() {
        const { width, height } = this.game.canvas;
        this.emitter.on(GameEvents.profileLoaded, this.loadProfile);
        this.emitter.emit(GameEvents.getProfile);
        this.load.image(
            "starsBackground",
            "static/images/backgrounds/Stars.png"
        );
        this.load.image(
            "nebulaBackground",
            "static/images/backgrounds/Nebula3.png"
        );
        this.load.image(
            "greenNebulaBackground",
            "static/images/backgrounds/greenNebula1.png"
        );
        this.load.image(
            "blueNebulaBackground",
            "static/images/backgrounds/blueNebula1.png"
        );
        this.load.image(
            "purpleNebulaBackground",
            "static/images/backgrounds/purpleNebula1.png"
        );
        this.load.image("purpleButton", "static/images/ui/purpleButton.png");
        this.load.image("goldSquare", "static/images/ui/goldSquare.png");
        this.load.image("creditsIcon", "static/images/ui/creditsIcon.png");
        this.load.image("menuSlot", "static/images/ui/menuSlot.png");

        this.load.spritesheet(
            "explosion",
            "static/images/effects/explosion.png",
            { frameWidth: 32, frameHeight: 32 }
        );
        this.load.spritesheet(
            "AsteroidExplode",
            "static/images/objects/animations/AsteroidExplode.png",
            { frameWidth: 96, frameHeight: 96 }
        );
        this.load.spritesheet(
            "nairanDreadnought",
            "static/images/ships/enemy/animations/NairanDreadnoughtDestruction.png",
            { frameWidth: 128, frameHeight: 128 }
        );

        this.load.image(PlayerShipSprites.T1, spriteSelector["ship1"]["T1"]);
        this.load.image(PlayerShipSprites.T2, spriteSelector["ship1"]["T2"]);
        this.load.image(PlayerShipSprites.T3, spriteSelector["ship1"]["T3"]);
        this.load.image(PlayerShipSprites.T4, spriteSelector["ship1"]["T4"]);
        this.load.image("bullet5", "static/images/bullets/bullet5.png");
        this.load.image("bullet5e", "static/images/bullets/bullet5e.png");

        this.load.image("enemyTank", "static/images/ships/enemy/2.png");
        this.load.image("enemyNormal", "static/images/ships/enemy/3.png");
        this.load.image("enemyElite", "static/images/ships/enemy/4.png");
        this.load.image("enemyBoss", "static/images/ships/enemy/8.png");
        this.load.image("umbralLogo", "static/images/umbralLogo.png");
        this.load.image("asteroid", "static/images/objects/AsteroidBase.png");

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

        // loader
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);
        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: "Loading...",
            style: {
                font: "20px monospace",
                color: "#fff",
            },
        });
        loadingText.setOrigin(0.5, 0.5);
        const percentText = this.make.text({
            x: width / 2,
            y: height / 2,
            text: "0%",
            style: {
                font: "18px monospace",
                color: "#ffffff",
            },
        });
        percentText.setOrigin(0.5, 0.5);
        var assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: "",
            style: {
                font: "18px monospace",
                color: "#ffffff",
            },
        });
        assetText.setOrigin(0.5, 0.5);

        this.load.on("progress", function (value) {
            //console.log(value);
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(
                width / 2 - 150,
                height / 2 - 15,
                300 * value,
                30
            );
            percentText.setText(parseInt((value * 100).toString()) + "%");
        });

        this.load.on("fileprogress", function (file: Phaser.Loader.File) {
            //console.log(file.src);
            assetText.setText("Loading asset: " + file.key);
        });
        this.load.on("complete", function () {
            //console.log("complete");
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });
    }

    create() {
        // const { width, height } = this.game.canvas;
        // const logo = this.add
        //     .image(width / 2, height / 2, "umbralLogo")
        //     .setOrigin(0.5, 0.5)
        //this.scale.resize(Math.min(window.innerWidth, gameWidth), Math.min(window.innerHeight, gameHeight))
        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("explosion", {
                start: 0,
                end: 5,
            }),
            frameRate: 8,
        });
        this.anims.create({
            key: "asteroidExplosion",
            frames: this.anims.generateFrameNumbers("AsteroidExplode", {
                start: 0,
                end: 7,
            }),
            frameRate: 8,
        });
        this.anims.create({
            key: "nairanDreadnoughtExplosion",
            frames: this.anims.generateFrameNumbers("nairanDreadnought", {
                start: 0,
                end: 17,
            }),
            frameRate: 8,
        });

        this.scene.start("GameScene", this.profile);
    }

    loadProfile = (data: PlayerWithInventory) => {
        this.profile = data;
    };
}
