export class HealthBar {
    private bar: Phaser.GameObjects.Graphics;
    private x: number;
    private y: number;
    private startHP: number;
    private value: number;
    private p: number;

    constructor(scene: Phaser.Scene, x: number, y: number, startHP: number) {
        this.bar = new Phaser.GameObjects.Graphics(scene);

        this.x = x;
        this.y = y;
        this.startHP = startHP;
        this.value = startHP;
        this.p = 1 / 100;

        this.draw();
        scene.add.text(x - 20, y, "HP");
        scene.add.existing(this.bar);
    }

    decrease(amount: number) {
        this.value -= amount;

        if (this.value < 0) {
            this.value = 0;
        }

        this.draw();

        return this.value === 0;
    }

    draw() {
        this.bar.clear();
        const startWidth = Math.floor(this.p * this.startHP);

        //  BG
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.y, startWidth, 16);

        //  Health

        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.x + 2, this.y + 2, startWidth, 12);

        if (this.value < this.startHP * 0.3) {
            this.bar.fillStyle(0xff0000);
        } else {
            this.bar.fillStyle(0x00ff00);
        }

        const d = Math.floor(this.p * this.value);

        this.bar.fillRect(this.x + 2, this.y + 2, d, 12);
    }
}
