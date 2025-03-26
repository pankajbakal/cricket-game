import { GameObject } from './GameObject.js';

export class Wickets extends GameObject {
    constructor() {
        super(50, 275, 15, 75); // Position wickets on ground (350 - height)
        this.remaining = 3;
        this.stumpWidth = 3;  // Individual stump width
        this.baleHeight = 5;  // Height of bales
    }

    hit() {
        this.remaining--;
        return this.remaining <= 0;
    }

    draw(ctx) {
        // Draw stumps
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x, this.y, this.stumpWidth, this.height);
        ctx.fillRect(this.x + 6, this.y, this.stumpWidth, this.height);
        ctx.fillRect(this.x + 12, this.y, this.stumpWidth, this.height);

        // Draw bales
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(this.x - 1, this.y, this.width + 2, this.baleHeight);
    }
}
