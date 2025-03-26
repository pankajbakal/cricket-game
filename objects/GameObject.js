export class GameObject {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(ctx, sprite) {
        ctx.drawImage(sprite, this.x, this.y, this.width, this.height);
    }

    collidesWith(other) {
        return this.x < other.x + other.width &&
               this.x + this.width > other.x &&
               this.y < other.y + other.height &&
               this.y + this.height > other.y;
    }

    scale(widthRatio, heightRatio) {
        this.x *= widthRatio;
        this.y *= heightRatio;
        this.width *= widthRatio;
        this.height *= heightRatio;
    }
}
