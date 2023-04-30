import Phaser from "phaser";
import { EventEmitter, GameEvents } from "~/utils/events";
import { PlayerEquipment, PlayerWithInventory } from "~/utils/gameTypes";


export default class InventoryMenuScene extends Phaser.Scene {
    private inventoryItems!: PlayerEquipment[]
    private profile!: PlayerWithInventory
    private emitter = EventEmitter.getInstance();
    private inventory!: Phaser.GameObjects.Image[]
    private container!: Phaser.GameObjects.Container

    constructor() {
        super('InventoryScene')
    }

    init(profileData: PlayerWithInventory) {
        this.profile = profileData
        this.inventoryItems = profileData.equipment
    }

    create() {
        const {width, height} = this.game.canvas
        this.inventory = this.inventoryItems.map((e, i) => this.add.image((i%3)*32, Math.floor(i/3)*32, e.sprite))



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


}