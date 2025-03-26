import { GameObject } from './GameObject.js';

export class Batsman extends GameObject {
    constructor(x, y) {
        super(100, 280, 50, 100); // Moved up from 300
        this.speed = 5;
        this.currentShot = null;
        this.shotAngle = 0;
        this.animationFrame = 0;
    }

    move(direction, canvasHeight) {
        const newY = this.y + (direction * this.speed);
        if (newY >= 230 && newY <= 280) { // Adjusted movement bounds
            this.y = newY;
        }
    }

    playShot(power) {
        // Improved shot selection based on power
        let shot;
        if (power > 80) {
            shot = 'hook'; // Big hitting shot
        } else if (power > 60) {
            shot = 'pull'; // Power shot
        } else if (power > 40) {
            shot = 'cover'; // Placement shot
        } else {
            shot = 'straight'; // Defensive shot
        }
        
        this.currentShot = shot;
        this.shotAngle = this.getShotAngle(shot);
        this.animationFrame = 10;
        
        console.log(`Playing ${shot} shot with power: ${power}`);
        return shot;
    }

    getShotAngle(shotType) {
        const angles = {
            'straight': Math.PI / 2,
            'cover': Math.PI / 3,
            'pull': 2 * Math.PI / 3,
            'hook': 3 * Math.PI / 4
        };
        return angles[shotType] || Math.PI / 2;
    }

    draw(ctx, sprite) {
        ctx.save();
        if (this.animationFrame > 0) {
            // Rotate batsman based on shot type
            ctx.translate(this.x + this.width/2, this.y + this.height/2);
            ctx.rotate(this.shotAngle * (this.animationFrame / 10));
            ctx.translate(-(this.x + this.width/2), -(this.y + this.height/2));
            this.animationFrame--;
        }
        super.draw(ctx, sprite);
        ctx.restore();
    }
}
