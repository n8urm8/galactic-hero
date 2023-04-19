import { Prisma } from "@prisma/client"
import { Rectangle } from "arcade-physics/lib/geom/rectangle/Rectangle"
import { EventEmitter, GameEvents } from "~/utils/events"
import { PlayerEquipment, PlayerShipWithEquipment, PlayerWithInventory } from "~/utils/gameTypes"
import { getLevelUpCost, ShipConstants } from "~/utils/ships"


export default class UpgradeMenu extends Phaser.Scene {

    private playerInventory!: PlayerWithInventory
    private emitter = EventEmitter.getInstance()
    private shipImg?: Phaser.GameObjects.Image
    private swapShipBtn?: Phaser.GameObjects.Image
    private swapShipBtnText?: Phaser.GameObjects.Text 
    private levelUpBtn?: Phaser.GameObjects.Image
    private lvlUpBtnText?: Phaser.GameObjects.Text  
    private levelText?: Phaser.GameObjects.Text  
    private levelUpCostText?: Phaser.GameObjects.Text 
    private healthText?: Phaser.GameObjects.Text 
    private shieldText?: Phaser.GameObjects.Text 
    private bDamageText?: Phaser.GameObjects.Text 
    private bSpeedText?: Phaser.GameObjects.Text
    private bDelayText?: Phaser.GameObjects.Text 
    private batteryText?: Phaser.GameObjects.Text 
    private equipmentBtn?: Phaser.GameObjects.Image
    private equipmentBtnText?: Phaser.GameObjects.Text 
    private currentShipId?: number

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
        this.currentShipId = currentShip?.id
        this.shipImg = this.add.image(8, 10, currentShip!.sprite).setOrigin(0,0)
        this.shipImg.displayHeight = menuHeight-20
        this.shipImg.scaleX = this.shipImg.scaleY

        this.levelUpBtn = this.add.image(menuWidth-63, 55, 'purpleButton').setInteractive({ useHandCursor: true })
            .once('pointerdown', () => {
            this.levelUp()
        })
        this.lvlUpBtnText = this.add.text(this.levelUpBtn.x, this.levelUpBtn.y, 'Lvl Up').setOrigin(0.5)
        
        this.swapShipBtn = this.add.image(this.shipImg.displayWidth/2 + 8, menuHeight-20, 'purpleButton').setInteractive({ useHandCursor: true })
            .once('pointerdown', () => {
            
        })
        this.swapShipBtnText = this.add.text(this.swapShipBtn.x, this.swapShipBtn.y, 'Swap').setOrigin(0.5)
        
        this.levelText = this.add.text(menuWidth-110, 5, `Level: ${currentShip!.level}`)
        // create formula to calculate cost of next level
        this.levelUpCostText = this.add.text(menuWidth-110, 22, `Cost: ${getLevelUpCost(currentShip!.level, 1)}`)
        // text for stats - need formula to calculate stats with equipment and levels
        this.healthText = this.add.text(menuWidth-110, 75, `Health: ${currentShip!.baseHP * 100}`)
        this.shieldText = this.add.text(menuWidth-110, 90, `Shield: ${currentShip!.shield / 1000}%`)
        this.bDamageText = this.add.text(menuWidth-110, 105, `Damage: ${currentShip!.bulletDamage}`)
        this.bSpeedText = this.add.text(menuWidth-110, 120, `Speed: ${currentShip!.bulletSpeed}`)
        this.bDelayText = this.add.text(menuWidth-110, 135, `Interval: ${currentShip!.shootDelay}`)
        this.batteryText = this.add.text(menuWidth-110, 150, `Battery: ${currentShip!.battery}`)
        this.getCurrentShip()

        // add equipment swapping
        this.equipmentBtn = this.add.image(menuWidth-58, menuHeight-20, 'purpleButton').setInteractive({ useHandCursor: true })
            .once('pointerdown', () => {
        
        })
        this.equipmentBtn.scaleX = 1.1
        this.equipmentBtnText = this.add.text(this.equipmentBtn.x, this.equipmentBtn.y, 'Equipment').setOrigin(0.5)
        

        menuContainer.add([
            background, 
            this.shipImg, 
            this.swapShipBtn,
            this.swapShipBtnText, 
            this.levelUpBtn, 
            this.lvlUpBtnText, 
            this.levelText, 
            this.levelUpCostText,
            this.healthText,
            this.shieldText,
            this.bDamageText,
            this.bSpeedText,
            this.bDelayText,
            this.batteryText,
            this.equipmentBtn,
            this.equipmentBtnText
        ])
     
        
    }

    update() {
        this.emitter.on(GameEvents.shipLeveled, this.completeLevelUp, this.emitter.removeListener(GameEvents.shipLeveled))

    }

    private levelUp = () => {
        console.log('leveling up!')
        this.emitter.emit(
            GameEvents.levelUpShip, 
            {
                playerId: this.playerInventory.id,
                shipId: this.currentShipId
            }
            )
    }

    completeLevelUp = (data: {player: PlayerWithInventory | string}) => {
        console.log('new level data', data.player)
        if (typeof data.player != 'string' && typeof data.player != 'undefined' ) {
            this.playerInventory = data.player
            this.getCurrentShip()
        }
    }

    private getCurrentShip = () => {
        let ship: PlayerShipWithEquipment = this.playerInventory.ships.filter((ship) => ship.isCurrent)[0]!
        let equipment: PlayerEquipment[] = ship.equipment

        this.shipImg?.setTexture(ship.sprite)

        this.levelText?.setText(`Level: ${ship.level}`)
        this.levelUpCostText?.setText(`Cost: ${getLevelUpCost(ship.level, 1)}`)

        let shipLvl = ship.level
        let health = ship.baseHP + ((shipLvl-1) * ShipConstants.hpPerLevel)
        let shield = ship.shield * (1+((shipLvl-1) * ShipConstants.shieldPerLevel / 100))
        let bulletDamage = ship.bulletDamage * (1+((shipLvl-1) * ShipConstants.damagePerLevel)) 
        let shootDelay = ship.shootDelay
        let totalBattery = ship.battery
        let bulletSpeed = ship.bulletSpeed

        for (let i = 0; i < equipment.length ; i++) {
            let equip = equipment[i]!
            let lvl = equip?.level
            health += equip.healthBonus * lvl
            shield += equip.shieldBonus * lvl
            bulletDamage += equip.bulletDamage * lvl
            bulletSpeed += equip.bulletSpeed * lvl
            shootDelay -= equip.shootDelay * lvl / ShipConstants.shootDelayDivisor

        }


        this.healthText?.setText(`Health: ${health}`)
        this.shieldText?.setText(`Shield: ${shield}%`)
        this.bDamageText?.setText(`Damage: ${bulletDamage}`)
        this.bSpeedText?.setText(`Speed: ${bulletSpeed}`)
        this.bDelayText?.setText(`Interval: ${shootDelay}`)
        this.batteryText?.setText(`Battery: ${totalBattery}`)
    }
}