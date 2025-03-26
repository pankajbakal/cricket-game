import { GameObject } from './GameObject.js';
import { Physics } from '../utils/Physics.js';

export class Ball extends GameObject {
    constructor() {
        super(700, 200, 20, 20);
        this.z = 0;
        this.time = 0;
        this.inPlay = false;
        this.trajectory = null;
        this.startX = this.x;
        this.startY = this.y;
        this.type = 'NORMAL';
        this.hasBounced = false;
        this.bounceEffect = null;
        this.wasHit = false;
        this.debug = false; // Disable debug mode
    }

    reset(power = 50, ballType = 'NORMAL') {
        // Get bowler's hand position (right side of bowler)
        const bowlerX = 650;
        const bowlerHandY = 260; // Higher position for bowler's hand

        this.x = bowlerX + 30; // Offset from bowler's position
        this.y = bowlerHandY;
        this.z = 70;  // Release height from hand
        this.time = 0;
        this.startX = this.x;
        this.startY = this.y;
        this.type = ballType;
        this.hasBounced = false;
        this.bounceEffect = null;
        this.wasHit = false; // Add this line
        
        // Add more randomization to ball properties
        const velocity = Math.min(power * (0.12 + Math.random() * 0.06), 10); // ±20% variation
        const angle = Math.PI + Math.PI / 6 + (Math.random() * 0.2 - 0.1); // ±0.1 rad variation
        const spin = Math.random() * 0.3 + 0.1; // More varied spin
        
        this.trajectory = Physics.calculateTrajectory(velocity, angle, spin, ballType);
        this.bouncePoint = this.trajectory.bouncePoint;
        this.inPlay = true;
    }

    collidesWith(object) {
        if (object.constructor.name === 'Batsman') {
            // Simple rectangle collision with expanded hit zone
            const hitZone = {
                x: object.x - 40,
                y: object.y - 30,
                width: object.width + 80,
                height: object.height + 60
            };

            const isInZone = 
                this.x >= hitZone.x &&
                this.x <= hitZone.x + hitZone.width &&
                this.y >= hitZone.y &&
                this.y <= hitZone.y + hitZone.height;

            // Only allow hitting if not already hit and in front of batsman
            const canHit = !this.wasHit && this.x > object.x - 50;

            return isInZone && canHit;
        }

        // For wickets, make check more precise
        if (object.constructor.name === 'Wickets') {
            return !this.wasHit && 
                   this.z < 50 && // Higher tolerance for wicket hits
                   this.x >= object.x - 5 && 
                   this.x <= object.x + object.width + 5;
        }

        return false;
    }

    update() {
        if (this.inPlay && this.trajectory) {
            this.time += 0.035; // Adjusted for smoother movement
            const pos = this.trajectory.getPosition(this.time);

            if (!pos) {
                this.inPlay = false; // Stop ball if it goes out of bounds
                return;
            }

            // Update position
            this.x = this.startX + pos.x;
            this.y = this.startY;
            this.z = pos.z;

            // Handle bounce and bounds
            if (!this.hasBounced && this.x <= this.trajectory.bouncePoint) {
                this.hasBounced = true;
                this.bounceEffect = { alpha: 1.0, size: 1.0 };
            }

            // Ensure ball continues past batsman
            if (this.x < -50) {
                this.inPlay = false;
            }
        }
    }

    draw(ctx, sprite) {
        if (this.inPlay) {
            const GROUND_Y = 350;
            
            // Draw bounce effect
            if (this.bounceEffect && this.bounceEffect.alpha > 0) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(this.bouncePoint, GROUND_Y, 5 * this.bounceEffect.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${this.bounceEffect.alpha})`;
                ctx.fill();
                ctx.restore();
                
                this.bounceEffect.alpha -= 0.05;
                this.bounceEffect.size += 0.2;
            }

            // Draw shadow on ground
            const shadowScale = Math.max(0.2, 1 - this.z/100);
            ctx.beginPath();
            ctx.ellipse(
                this.x + this.width/2,
                GROUND_Y,
                10 * shadowScale,
                5 * shadowScale,
                0,
                0,
                Math.PI * 2
            );
            ctx.fillStyle = `rgba(0,0,0,${0.3 * shadowScale})`;
            ctx.fill();
            
            // Draw ball at height from ground
            const ballSize = 20 + (this.z * 0.05); // Reduced size variation
            ctx.drawImage(sprite, 
                this.x, this.y - this.z, 
                ballSize, ballSize
            );

            ctx.restore();
        }
    }
}
