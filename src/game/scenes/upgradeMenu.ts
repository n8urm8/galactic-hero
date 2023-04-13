import { Prisma } from "@prisma/client"
import { Rectangle } from "arcade-physics/lib/geom/rectangle/Rectangle"
import { PlayerWithInventory } from "~/utils/gameTypes"


export default class UpgradeMenu extends Phaser.Scene {

    private playerInventory!: PlayerWithInventory

    constructor(
    ){
        super('UpgradeMenuScene')
    }

    init(data: {profileData: any}) {
        this.playerInventory = data.profileData
    }
    create() {
        const {width, height} = this.game.canvas
        const menuHeight = 200
        const menuWidth = 300
        const menuContainer = this.add.container(5, height-240)
        const background = this.add.image(0, 0, 'goldSquare')
        background.setDisplaySize(menuWidth, menuHeight).setOrigin(0)
        background.scaleX= background.scaleX*1.2

        const currentShip = this.playerInventory.ships.filter((ship) => ship.isCurrent)[0]

        const shipImg = this.add.image(8, 10, currentShip!.sprite).setOrigin(0,0)
        shipImg.displayHeight = menuHeight-20
        shipImg.scaleX = shipImg.scaleY

        const levelUpBtn = this.add.image(menuWidth-63, 55, 'purpleButton').setInteractive({ useHandCursor: true })
            .once('pointerdown', () => {
            
        })
        let lvlUpBtnText = this.add.text(levelUpBtn.x, levelUpBtn.y, 'Lvl Up').setOrigin(0.5)
        
        const swapShipBtn = this.add.image(shipImg.displayWidth/2 + 8, menuHeight-20, 'purpleButton').setInteractive({ useHandCursor: true })
            .once('pointerdown', () => {
            
        })
        let swapShipBtnText = this.add.text(swapShipBtn.x, swapShipBtn.y, 'Swap').setOrigin(0.5)
        
        let levelText = this.add.text(menuWidth-110, 5, `Level: ${currentShip!.level}`)
        // create formula to calculate cost of next level
        let levelUpCostText = this.add.text(menuWidth-110, 22, `Cost: ${currentShip!.level * 100}`)
        // text for stats - need formula to calculate stats with equipment and levels
        let healthText = this.add.text(menuWidth-110, 75, `Health: ${currentShip!.baseHP * 100}`)
        let shieldText = this.add.text(menuWidth-110, 90, `Shield: ${currentShip!.shield / 1000}%`)
        let bDamageText = this.add.text(menuWidth-110, 105, `Damage: ${currentShip!.bulletDamage}`)
        let bDelayText = this.add.text(menuWidth-110, 120, `Interval: ${currentShip!.shootDelay}`)
        let batteryText = this.add.text(menuWidth-110, 135, `Battery: ${currentShip!.battery}`)
        // let batterySlotsText = this.add.text(menuWidth-110, 170, `Cost: ${currentShip!.batterySlots}`)

        // add equipment swapping
        const equipmentBtn = this.add.image(menuWidth-58, menuHeight-20, 'purpleButton').setInteractive({ useHandCursor: true })
            .once('pointerdown', () => {
        
        })
        equipmentBtn.scaleX = 1.1
        let equipmentBtnText = this.add.text(equipmentBtn.x, equipmentBtn.y, 'Equipment').setOrigin(0.5)
        

        menuContainer.add([
            background, 
            shipImg, 
            swapShipBtn,
            swapShipBtnText, 
            levelUpBtn, 
            lvlUpBtnText, 
            levelText, 
            levelUpCostText,
            healthText,
            shieldText,
            bDamageText,
            bDelayText,
            batteryText,
            equipmentBtn,
            equipmentBtnText
        ])
     
        
    }

    update() {

    }
}