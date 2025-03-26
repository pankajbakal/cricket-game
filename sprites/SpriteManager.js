export class SpriteManager {
    createBatsmanSprite() {
        return this.createSprite(50, 100, (ctx) => {
            // Body
            const gradient = ctx.createLinearGradient(20, 20, 30, 80);
            gradient.addColorStop(0, '#444');
            gradient.addColorStop(1, '#000');
            ctx.fillStyle = gradient;
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 5;
            ctx.shadowOffsetX = 2;
            ctx.fillRect(20, 20, 10, 60);

            // Arms
            ctx.fillRect(10, 40, 30, 20);

            // Bat
            const batGradient = ctx.createLinearGradient(30, 30, 50, 35);
            batGradient.addColorStop(0, '#8B4513');
            batGradient.addColorStop(1, '#A0522D');
            ctx.fillStyle = batGradient;
            ctx.fillRect(30, 30, 20, 5);
        });
    }

    createBowlerSprite() {
        return this.createSprite(50, 100, (ctx) => {
            // Body
            const gradient = ctx.createLinearGradient(20, 20, 30, 80);
            gradient.addColorStop(0, '#444');
            gradient.addColorStop(1, '#000');
            ctx.fillStyle = gradient;
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 5;
            ctx.fillRect(20, 20, 10, 60);

            // Bowling arm
            ctx.beginPath();
            ctx.moveTo(30, 40);
            ctx.quadraticCurveTo(40, 50, 35, 60);
            ctx.stroke();
        });
    }

    createBallSprite() {
        return this.createSprite(30, 30, (ctx) => {
            // Make ball more visible with stronger colors
            const gradient = ctx.createRadialGradient(15, 15, 0, 15, 15, 12);
            gradient.addColorStop(0, '#ffffff');
            gradient.addColorStop(0.6, '#ff0000');
            gradient.addColorStop(1, '#cc0000');
            
            ctx.fillStyle = gradient;
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 5;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            
            ctx.beginPath();
            ctx.arc(15, 15, 12, 0, Math.PI * 2);
            ctx.fill();

            // Add seam details
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(15, 15, 8, 0, Math.PI, true);
            ctx.stroke();
        });
    }

    createWicketsSprite() {
        return this.createSprite(30, 150, (ctx) => {
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(0, 0, 5, 150);
            ctx.fillRect(12, 0, 5, 150);
            ctx.fillRect(24, 0, 5, 150);
        });
    }

    createSprite(width, height, drawFn) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        drawFn(ctx);
        const img = new Image();
        img.src = canvas.toDataURL();
        return img;
    }
}
