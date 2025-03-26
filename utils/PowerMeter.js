export class PowerMeter {
    constructor() {
        this.power = 0;
        this.increasing = false;
        this.max = 100;
    }

    start() {
        this.increasing = true;
        this.increasePower();
    }

    stop() {
        this.increasing = false;
        const currentPower = this.power;
        this.power = 0;
        return currentPower;
    }

    increasePower() {
        if (this.increasing) {
            this.power = (this.power + 2) % this.max;
            requestAnimationFrame(() => this.increasePower());
        }
    }

    draw(ctx) {
        if (this.increasing) {
            ctx.fillStyle = '#333';
            ctx.fillRect(350, 350, 100, 20);
            ctx.fillStyle = 'red';
            ctx.fillRect(350, 350, this.power, 20);
        }
    }
}
