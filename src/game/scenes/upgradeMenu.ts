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
        const background = this.add.graphics()
        background.fillRect(0, 0, 300, 200).fillStyle(0x7a7a7a, 0.75)

        const menuContainer = this.add.container(width*.01, height*.35)
        menuContainer.add(background)
     
        
    }

    update() {

    }
}