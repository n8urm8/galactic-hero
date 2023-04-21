import Phaser from "phaser";

export class PurpleButton extends Phaser.GameObjects.Image {

    private click: () => void;

    constructor(scene: Phaser.Scene, x: number, y: number, text: string, action: () => void, container?: Phaser.GameObjects.Container, scaleX?: number) {
        super(scene, x, y, 'purpleButton')
        scene.add.existing(this)
        if (scaleX) this.scaleX = scaleX
        this.click = action
        this.setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.click()
            },
            this.removeListener('pointerdown')
        )
        let btnText = scene.add.text(x, y, text).setOrigin(0.5)
        if (container) container.add(btnText)
    }
}