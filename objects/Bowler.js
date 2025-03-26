import { GameObject } from './GameObject.js';
import { Physics } from '../utils/Physics.js';

export class Bowler extends GameObject {
    constructor() {
        super(650, 280, 50, 100); // Moved up from 300
        this.bowlingFrame = 0;
        this.isBowling = false;
        this.ballTypes = Object.keys(Physics.BallTypes);
        this.currentBallType = 'NORMAL';
        this.releasePoint = 0;
    }

    startBowling() {
        this.isBowling = true;
        this.bowlingFrame = 0;
        // Random release point between 15-25 frames
        this.releasePoint = Math.floor(15 + Math.random() * 10);
        
        // More varied ball type selection
        const weights = {
            NORMAL: 0.25,
            YORKER: 0.2,
            BOUNCER: 0.2,
            OFFBREAK: 0.2,
            SLOWER: 0.15
        };

        // Ensure random selection based on weights
        const rand = Math.random();
        let sum = 0;
        for (const [type, weight] of Object.entries(weights)) {
            sum += weight;
            if (rand <= sum) {
                this.currentBallType = type;
                break;
            }
        }
    }

    getCurrentBallType() {
        return this.currentBallType;
    }

    update() {
        if (this.isBowling) {
            this.bowlingFrame++;
            // Return true only at release point
            if (this.bowlingFrame === this.releasePoint) {
                return true;
            } else if (this.bowlingFrame > 30) {
                this.isBowling = false;
                this.bowlingFrame = 0;
            }
        }
        return false;
    }

    draw(ctx, sprite) {
        // Draw shadow first
        ctx.beginPath();
        ctx.ellipse(
            this.x + this.width/2,
            350,
            this.width/2,
            10,
            0,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fill();

        // Draw bowler with bowling animation
        ctx.save();
        if (this.isBowling) {
            ctx.translate(this.x + 25, this.y + 50);
            ctx.rotate((-this.bowlingFrame / 30) * Math.PI / 2); // Adjusted rotation
            ctx.translate(-(this.x + 25), -(this.y + 50));
        }
        super.draw(ctx, sprite);
        ctx.restore();
    }
}
