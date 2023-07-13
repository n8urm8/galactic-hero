import Phaser from "phaser";
import { PlayerEquipment, PlayerShip } from "~/utils/gameTypes";

// custom class to manage inventory items like equipment and ships
export class InventoryItem {

    scene: Phaser.Scene
    private item: PlayerEquipment | PlayerShip
    private itemMenu: Phaser.GameObjects.Container | undefined
    private itemSprite: Phaser.GameObjects.Image
    private itemLvlText?: Phaser.GameObjects.Text

    constructor(
        scene: Phaser.Scene, 
        x: number, 
        y: number, 
        item: (PlayerEquipment | PlayerShip),
        container?: Phaser.GameObjects.Container
        ) {
        this.scene = scene
        this.item = item
        this.itemMenu = container

        this.itemSprite = this.scene.add.image(x, y, item.sprite).setOrigin(0).setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.openItemMenu()
            },
            this.scene.events.removeListener('pointerdown')
        )
        if (item.level > 0){
            this.itemLvlText = scene.add.text(this.itemSprite.x - 5, this.itemSprite.y - 5, `+${item.level}`)
            container && container.add(this.itemLvlText)
        }

        container && container.addAt([
            this.itemSprite
        ], 0)
    }

    openItemMenu = () => {
        // look into using the same menu as the upgradesmenu
        console.log(
            'menu opened', this.item.id
        )
    }

    destroy = () => {
        this.itemSprite.destroy()
    }

}