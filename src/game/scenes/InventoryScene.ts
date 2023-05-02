import Phaser from "phaser";
import { EventEmitter, GameEvents } from "~/utils/events";
import { PlayerEquipment, PlayerShip, PlayerWithInventory } from "~/utils/gameTypes";


export default class InventoryMenuScene extends Phaser.Scene {
    private inventoryItems!: PlayerEquipment[] | PlayerShip[]
    private profile!: PlayerWithInventory
    private emitter = EventEmitter.getInstance();
    private inventory!: (Phaser.GameObjects.Image | false)[]
    private menuContainer!: Phaser.GameObjects.Container
    private page = 1
    private maxPage = 1
    private title!: string
    private titleText!: Phaser.GameObjects.Text
    private pageText!: Phaser.GameObjects.Text
    private pageLeft!: Phaser.GameObjects.Text
    private pageRight!: Phaser.GameObjects.Text
    private closeBtn!: Phaser.GameObjects.Text
    private background!: Phaser.GameObjects.Image

    constructor() {
        super('InventoryScene')
    }

    init(data: {profileData: PlayerWithInventory, type: 'Equipment' | 'Ships'}) {
        
        this.profile = data.profileData
        if (data.type == 'Equipment') {
            this.inventoryItems = data.profileData.equipment
            this.inventoryItems.sort((a, b) => a.type.localeCompare(b.type))
        } else {
            this.inventoryItems = data.profileData.ships
            this.inventoryItems.sort((a, b) => a.level - b.level)
        }
        this.maxPage = Math.floor(this.inventoryItems.length / 28)+1
        this.title = data.type
        
    }

    create() {
        const {width, height} = this.game.canvas
        this.inventory = this.inventoryItems.map((e, i) => i < 28*this.page && i >= 28*(this.page-1) && this.add.image(10+(i%7)*38, 25+Math.floor(i/7)%4*38, e.sprite).setOrigin(0))
        const menuHeight = 200
        const menuWidth = 280
        this.background = this.add.image(0, 0, 'goldSquare')
        this.background.setDisplaySize(menuWidth, menuHeight).setOrigin(0)
        //background.scaleX = background.scaleX*1.2
        this.titleText = this.add.text(10, 5, this.title)
        this.pageLeft = this.add.text((menuWidth/2)-30, menuHeight-12, '<').setOrigin(0.5).setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.changePage(-1)
            },
            this.events.removeListener('pointerdown')
        )
        this.pageRight = this.add.text(30+ (menuWidth/2), menuHeight-12, '>').setOrigin(0.5).setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.changePage(1)
            },
            this.events.removeListener('pointerdown')
        )
        this.pageText = this.add.text(menuWidth/2, menuHeight-12, `1/${this.maxPage}`).setOrigin(0.5)
        this.closeBtn = this.add.text(menuWidth-15, 10, 'X').setOrigin(0.5).setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.stop()
            },
            this.events.removeListener('pointerdown')
        )
        
        this.menuContainer = this.add.container(370, height-240, [
            this.background,
            this.titleText,
            this.pageLeft,
            this.pageRight,
            this.pageText,
            this.closeBtn,
        ])
        this.inventory.forEach((item, i) => item != false && this.menuContainer.add(item))



    }

    update() {
        this.emitter.on(GameEvents.profileLoaded, 
          this.updateProfileAndInventory,
          this.emitter.removeListener(GameEvents.profileLoaded)
        )

    }

    updateProfileAndInventory = (data: PlayerWithInventory) => {
        this.profile = data
        this.inventoryItems = data.equipment
    }

    changePage = (direction: number) => {
        let page = this.page
        if (direction < 0) {
            page = Math.max(1, page + direction)
        } else {
            page = Math.min(this.maxPage, page + direction)
        }
        if ((this.page == 1 && direction < 0) || (this.page == this.maxPage && direction > 0)) {
            return
        } else {
            this.page = page
            this.pageText.setText(`${this.page}/${this.maxPage}`)
            this.menuContainer.removeBetween(5, this.menuContainer.length)
            this.inventory.forEach(item => item != false && item.destroy())
            // add the next set of up to 28 items
            this.inventory = this.inventoryItems.map(
                (e, i) => i < 28*this.page && i >= 28*(this.page-1) 
                && this.add.image(
                    10+(i%7)*38, 25+(Math.floor(i/7)%4)*38,
                    e.sprite
                )
                .setOrigin(0)
            )
            this.inventory.forEach(item => item != false && this.menuContainer.add(item))
        }

    }


}