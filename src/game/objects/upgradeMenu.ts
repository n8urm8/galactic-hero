import { Prisma } from "@prisma/client"
import { Rectangle } from "arcade-physics/lib/geom/rectangle/Rectangle"
import { PlayerWithInventory } from "~/utils/gameTypes"


export default class UpgradeMenu extends Phaser.GameObjects.Container {

    private playerInventory: PlayerWithInventory

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        profileInventory: PlayerWithInventory 
    ){
        super(scene, x, y)
        this.setActive(true)
        this.setVisible(true)
        this.playerInventory = profileInventory
    }

    create() {
        const background = new Rectangle(0,0, 200, 300)
    }

    update() {

    }
}