export class Physics {
    static gravity = 9.81;
    static airResistance = 0.47;
    static ballMass = 0.16;
    static ballRadius = 0.036;

    static PITCH_LENGTH = 600; // Length of pitch in pixels
    static PITCH_START = 150;  // Starting X position of pitch

    static BallTypes = {
        YORKER: { 
            height: () => 15 + Math.random() * 10,
            speed: () => 14 + Math.random() * 3,    // Increased speed: 14-17
            swing: () => 1.0 + Math.random() * 0.4,
            bouncePoint: 550
        },
        BOUNCER: {
            height: () => 75 + Math.random() * 10,
            speed: () => 13 + Math.random() * 2,    // Increased speed: 13-15
            swing: () => 0.2 + Math.random() * 0.2,
            bouncePoint: 250
        },
        NORMAL: {
            height: () => 45 + Math.random() * 10,
            speed: () => 12 + Math.random() * 2,    // Increased speed: 12-14
            swing: () => 0.6 + Math.random() * 0.4,
            bouncePoint: 400
        },
        OFFBREAK: {
            height: () => 40 + Math.random() * 10,
            speed: () => 10 + Math.random() * 2,    // Increased speed: 10-12
            swing: () => 1.3 + Math.random() * 0.4,
            bouncePoint: 350
        },
        SLOWER: {
            height: () => 30 + Math.random() * 10,
            speed: () => 8 + Math.random() * 2,     // Increased speed: 8-10
            swing: () => 0.3 + Math.random() * 0.2,
            bouncePoint: 450
        }
    };

    static screenWidth = 800;
    static screenHeight = 400;

    static updateScreenDimensions(width, height) {
        this.screenWidth = width;
        this.screenHeight = height;
        this.PITCH_LENGTH = width * 0.75; // 75% of screen width
        this.PITCH_START = width * 0.1875; // 18.75% of screen width

        // Update ball types bounce points
        this.BallTypes = {
            YORKER: { ...this.BallTypes.YORKER, bouncePoint: width * 0.6875 },
            BOUNCER: { ...this.BallTypes.BOUNCER, bouncePoint: width * 0.3125 },
            NORMAL: { ...this.BallTypes.NORMAL, bouncePoint: width * 0.5 },
            OFFBREAK: { ...this.BallTypes.OFFBREAK, bouncePoint: width * 0.4375 },
            SLOWER: { ...this.BallTypes.SLOWER, bouncePoint: width * 0.5625 }
        };
    }

    static calculateTrajectory(initialVelocity, angle, spin, ballType = 'NORMAL') {
        const type = this.BallTypes[ballType];
        const height = type.height();
        const speed = type.speed();
        const swingFactor = type.swing();
        const bouncePoint = type.bouncePoint; // Correctly reference bouncePoint from type

        return {
            getPosition: (t) => {
                const baseSpeed = speed * 8; // Adjusted speed for better reach
                const x = -baseSpeed * t;

                // Ensure ball reaches batsman and continues past
                const currentX = 700 + x;
                const adjustedBounceX = bouncePoint + (Math.random() * 10 - 5); // Properly define adjustedBounceX

                let z;
                if (currentX > adjustedBounceX) {
                    const progress = (currentX - adjustedBounceX) / (700 - adjustedBounceX);
                    z = height * Math.sin(progress * Math.PI); // Smooth height before bounce
                } else {
                    const progress = (adjustedBounceX - currentX) / 200;
                    z = height * 0.5 * Math.sin(progress * Math.PI); // Smooth height after bounce
                }

                // Add swing for realism
                const swing = Math.sin(t * 2) * swingFactor * 2;

                // Ensure ball doesn't disappear prematurely
                if (currentX < -50) {
                    return null; // Ball is out of bounds
                }

                return {
                    x: x + swing,
                    y: 0,
                    z: Math.max(0, z)
                };
            },
            bouncePoint: bouncePoint // Return the original bouncePoint for reference
        };
    }

    static parabolaHeight(x, maxHeight) {
        // Simple parabola formula: 4h(x/w)(1-x/w) where h is height and w is width
        const width = 200;
        return maxHeight * 4 * (x/width) * (1 - x/width);
    }

    static pixelsPerMeter = 50; // Reduced scale factor

    static worldToScreen(x, y, z) {
        const scale = this.screenWidth / (this.screenWidth + z);
        return {
            x: x * scale * (this.screenWidth / 800),
            y: y * scale * (this.screenHeight / 400)
        };
    }
}
