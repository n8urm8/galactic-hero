import { Ship } from "@prisma/client";
import Phaser from "phaser";
import { PlayerEquipment, PlayerShip } from "~/utils/gameTypes";
import { ShipConstants } from "~/utils/statFormulas";

export class ItemUpgradeMenu {
    private scene: Phaser.Scene;
    private item: PlayerEquipment | PlayerShip;
    private itemMenu: Phaser.GameObjects.Container;
    private outerContainer?: Phaser.GameObjects.Container | undefined;
    private itemSprite: Phaser.GameObjects.Image;
    private statsText: Phaser.GameObjects.Text;
    private background!: Phaser.GameObjects.Image;
    private isOpen = false;
    private type: "ship" | "equipment";

    constructor(
        scene: Phaser.Scene,
        item: PlayerEquipment | PlayerShip,
        type: "ship" | "equipment",
        container?: Phaser.GameObjects.Container
    ) {
        this.scene = scene;
        this.item = item;
        if (container) {
            this.outerContainer = container;
        }
        this.type = type;
        const { width, height } = scene.game.canvas;
        const menuHeight = 200;
        const menuWidth = 280;
        this.background = scene.add.image(0, 0, "goldSquare");
        this.background.setDisplaySize(menuWidth, menuHeight).setOrigin(0);
        this.itemSprite = scene.add
            .image(10, menuHeight / 2, item.sprite)
            .setOrigin(0);
        this.statsText = scene.add.text(
            menuWidth - 110,
            10,
            this.getStatsText()
        );
        // container for item data display
        this.itemMenu = scene.add
            .container(170, height - 240)
            .setActive(false)
            .setVisible(false);
    }

    toggle = () => {
        if (!this.isOpen) {
            this.itemMenu.setActive(true).setVisible(true);
            this.isOpen = true;
        } else {
            this.itemMenu.setActive(false).setVisible(false);
            this.isOpen = false;
        }
    };

    private getStatsText = (): string => {
        let statsText = "";
        const {
            health,
            shield,
            bulletDamage,
            bulletRange,
            bulletSpeed,
            level,
            shootDelay,
            battery,
        } = this.item;

        if (this.type == "equipment") {
            statsText = `
                Level: ${level}
                \nHealth: ${health * level}
                \nShield: ${shield * level}%
                \nDamage: ${bulletDamage * level}
                \nSpeed: ${bulletSpeed * level}
                \nInterval: ${
                    (shootDelay * level) / ShipConstants.shootDelayDivisor
                }
                \nRange: ${bulletRange}
                \nBattery: ${battery}
            `;
        } else {
            statsText = `
                Level: ${level}
                \nHealth: ${health + (level - 1) * ShipConstants.hpPerLevel}
                \nShield: ${
                    shield *
                    (1 +
                        ((level - 1) * ShipConstants.shieldPerLevel) /
                            ShipConstants.shieldStatDivisor)
                }%
                \nDamage: ${
                    bulletDamage *
                    (1 + (level - 1) * ShipConstants.damagePerLevel)
                }
                \nSpeed: ${bulletSpeed}
                \nInterval: ${shootDelay}
                \nRange: ${bulletRange}
                \nBattery: ${battery}
            `;
        }
        return statsText;
    };
}
