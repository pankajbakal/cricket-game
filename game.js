import { SpriteManager } from './sprites/SpriteManager.js';
import { Batsman } from './objects/Batsman.js';
import { Ball } from './objects/Ball.js';
import { Wickets } from './objects/Wickets.js';
import { SoundManager } from './utils/SoundManager.js';
import { GameState } from './utils/GameState.js';
import { PowerMeter } from './utils/PowerMeter.js';
import { Bowler } from './objects/Bowler.js';

class CricketGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.setCanvasSize();
        
        // Add resize listener
        window.addEventListener('resize', () => this.handleResize());
        
        this.spriteManager = new SpriteManager();
        this.soundManager = new SoundManager();
        this.gameState = new GameState();
        this.powerMeter = new PowerMeter();
        
        this.initializeGameObjects();
        this.loadSprites();
        this.setupKeyboardControls(); // Only keyboard controls now
        this.resetGame();
        this.boundaryAnimation = null;
        this.GROUND_Y = 350; // Fixed ground position
        this.CENTER_X = this.canvas.width / 2;  // Center of screen
        this.BATSMAN_X = this.CENTER_X - 250;   // Left side of center
        this.BOWLER_X = this.CENTER_X + 250;    // Right side of center
        this.WICKETS_X = this.CENTER_X - 300;   // Behind batsman
        this.debug = false; // Disable debug mode
    }

    setCanvasSize() {
        const margin = 40; // Margin from window edges
        this.canvas.width = Math.min(1200, window.innerWidth - margin);
        this.canvas.height = Math.min(600, window.innerHeight - margin * 3);
        
        // Set scale factors based on default size (800x400)
        this.scaleX = this.canvas.width / 800;
        this.scaleY = this.canvas.height / 400;
        
        // Update ground positions
        this.groundY = this.canvas.height * 0.875; // 350/400
        this.pitchStart = this.canvas.width * 0.1875; // 150/800
        this.pitchEnd = this.canvas.width * 0.8125; // 650/800
    }

    handleResize() {
        const oldWidth = this.canvas.width;
        const oldHeight = this.canvas.height;
        
        this.setCanvasSize();
        
        // Adjust object positions
        const widthRatio = this.canvas.width / oldWidth;
        const heightRatio = this.canvas.height / oldHeight;
        
        // Update game object positions
        if (this.batsman) this.batsman.scale(widthRatio, heightRatio);
        if (this.bowler) this.bowler.scale(widthRatio, heightRatio);
        if (this.wickets) this.wickets.scale(widthRatio, heightRatio);
        
        // Update Physics settings
        Physics.updateScreenDimensions(this.canvas.width, this.canvas.height);
    }

    loadSprites() {
        this.sprites = {
            batsman: this.spriteManager.createBatsmanSprite(),
            ball: this.spriteManager.createBallSprite(),
            wickets: this.spriteManager.createWicketsSprite(),
            bowler: this.spriteManager.createBowlerSprite()
        };
        this.startGame();
    }

    initializeGameObjects() {
        this.batsman = new Batsman(this.BATSMAN_X, 300);
        this.bowler = new Bowler(this.BOWLER_X, 300);
        this.ball = new Ball();
        this.wickets = new Wickets(this.WICKETS_X, 275);
    }

    setupKeyboardControls() {
        window.addEventListener('keydown', (e) => {
            switch(e.code) {
                case 'ArrowUp':
                    this.moveUp = true;
                    break;
                case 'ArrowDown':
                    this.moveDown = true;
                    break;
                case 'Space':
                    if (!this.powerMeter.increasing) {
                        this.powerMeter.start();
                    }
                    break;
                case 'Enter':
                    if (this.gameState.isGameOver) {
                        this.resetGame();
                    }
                    break;
            }
        });

        window.addEventListener('keyup', (e) => {
            switch(e.code) {
                case 'ArrowUp':
                    this.moveUp = false;
                    break;
                case 'ArrowDown':
                    this.moveDown = false;
                    break;
                case 'Space':
                    if (this.powerMeter.increasing) {
                        const power = this.powerMeter.stop();
                        this.hit(power);
                    }
                    break;
            }
        });
    }

    resetGame() {
        this.gameState.reset();
        this.wickets.remaining = 3;
        this.gameState.updateWickets(this.wickets.remaining);
        this.updateScore();
        document.getElementById('gameOver').classList.add('hidden');
    }

    startGame() {
        this.gameLoop();
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        if (this.moveUp || this.moveDown) {
            this.batsman.move(this.moveUp ? -1 : 1, this.canvas.height);
        }

        if (this.bowler.update() && !this.ball.inPlay) {
            const ballType = this.bowler.getCurrentBallType();
            this.ball.reset(50, ballType);
        }

        if (this.ball && this.ball.inPlay) {
            this.ball.update();
            
            // Only check for wicket hit if ball wasn't hit by batsman
            if (this.ball.collidesWith(this.batsman)) {
                this.handleHit();
            } else if (!this.ball.wasHit && this.ball.collidesWith(this.wickets)) {
                this.handleWicketHit();
            }
            
            // Stop ball if it goes too far
            if (this.ball.x < 50) {
                this.ball.inPlay = false;
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw ground with perspective
        this.drawGround();
        
        // Draw game objects
        this.wickets.draw(this.ctx);
        this.drawWithShadow(this.batsman, this.sprites.batsman);
        this.drawWithShadow(this.bowler, this.sprites.bowler);
        if (this.ball.inPlay) {
            this.ball.draw(this.ctx, this.sprites.ball);
        }
        
        this.powerMeter.draw(this.ctx);

        // Draw boundary animation
        if (this.boundaryAnimation) {
            this.ctx.save();
            this.ctx.globalAlpha = this.boundaryAnimation.alpha;
            this.ctx.font = `${48 * this.boundaryAnimation.scale}px Arial`;
            this.ctx.fillStyle = 'red';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(this.boundaryAnimation.text, 400, 200);
            this.ctx.restore();

            // Update animation
            this.boundaryAnimation.alpha -= 0.02;
            this.boundaryAnimation.scale += 0.05;
            if (this.boundaryAnimation.alpha <= 0) {
                this.boundaryAnimation = null;
            }
        }

        // Draw current shot type
        if (this.batsman.currentShot) {
            this.ctx.font = '20px Arial';
            this.ctx.fillStyle = 'black';
            this.ctx.fillText(`Shot: ${this.batsman.currentShot}`, 20, 30);
        }

        // Show current ball type
        if (this.ball.inPlay) {
            this.ctx.font = '16px Arial';
            this.ctx.fillStyle = 'black';
            this.ctx.fillText(`Ball Type: ${this.ball.type}`, 20, 50);
        }
    }

    drawGround() {
        // Sky
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Ground
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.GROUND_Y);
        this.ctx.lineTo(this.canvas.width, this.GROUND_Y);
        this.ctx.lineTo(this.canvas.width, this.canvas.height);
        this.ctx.lineTo(0, this.canvas.height);
        this.ctx.closePath();
        
        const gradient = this.ctx.createLinearGradient(0, this.groundY, 0, this.canvas.height);
        gradient.addColorStop(0, '#90EE90');
        gradient.addColorStop(1, '#228B22');
        this.ctx.fillStyle = gradient;
        this.ctx.fill();

        // Draw crease lines
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.pitchStart, this.groundY);
        this.ctx.lineTo(this.pitchStart, this.canvas.height);
        this.ctx.moveTo(this.pitchEnd, this.groundY);
        this.ctx.lineTo(this.pitchEnd, this.canvas.height);
        this.ctx.stroke();

        // Pitch
        this.ctx.beginPath();
        this.ctx.moveTo(this.pitchStart, this.groundY);
        this.ctx.lineTo(this.pitchEnd, this.groundY);
        this.ctx.lineTo(this.pitchEnd, this.canvas.height);
        this.ctx.lineTo(this.pitchStart, this.canvas.height);
        this.ctx.closePath();
        this.ctx.fillStyle = '#c2b280';
        this.ctx.fill();
    }

    drawWithShadow(object, sprite) {
        // Draw shadow at ground level
        this.ctx.beginPath();
        this.ctx.ellipse(
            object.x + object.width/2,
            this.GROUND_Y,
            object.width/2,
            object.width/4,
            0,
            0,
            Math.PI * 2
        );
        this.ctx.fillStyle = 'rgba(0,0,0,0.3)';
        this.ctx.fill();

        // Draw object
        object.draw(this.ctx, sprite);
    }

    hit(power) {
        if (!this.ball.inPlay) {
            this.bowler.startBowling();
            if (power) {
                this.ball.reset(power);
            }
        }
    }

    calculateTiming() {
        if (!this.ball || !this.ball.inPlay) return 0;

        // Simple timing calculation based on distance from batsman
        const idealX = this.batsman.x + this.batsman.width / 2;
        const distance = Math.abs(this.ball.x - idealX);
        
        // More lenient timing windows
        if (distance < 40) return 1.0;      // Perfect
        if (distance < 60) return 0.8;      // Good
        if (distance < 80) return 0.5;      // Fair
        return 0.2;                         // Poor
    }

    calculateScore(power, timing) {
        const baseScore = (power * timing) / 30;
        const randomFactor = 0.8 + (Math.random() * 0.4); // Random factor between 0.8 and 1.2
        const finalScore = Math.floor(baseScore * randomFactor);

        // Add some randomness to boundaries
        if (timing >= 0.8 && power >= 70) {
            // 70% chance of six if conditions met
            return Math.random() < 0.7 ? 6 : 4;
        }
        if (timing >= 0.6 && power >= 50) {
            // 60% chance of four if conditions met
            return Math.random() < 0.6 ? 4 : Math.min(3, finalScore);
        }

        // Regular scoring with randomization
        if (timing >= 0.4) {
            return Math.min(3, Math.max(1, finalScore));
        }

        // 30% chance of single run on poor timing
        return Math.random() < 0.3 ? 1 : 0;
    }

    handleHit() {
        const power = this.powerMeter.power || 50;
        const timing = this.calculateTiming();

        console.log('Hit attempt:', { power, timing });

        const shotType = this.batsman.playShot(power);
        const points = this.calculateScore(power, timing);

        console.log('Shot result:', { 
            shotType, 
            points, 
            power, 
            timing,
            randomFactor: Math.random()
        });

        if (points > 0) {
            this.gameState.updateScore(points);
            if (points >= 4) {
                this.boundaryAnimation = {
                    text: points === 6 ? 'SIX!' : 'FOUR!',
                    alpha: 1.0,
                    scale: 1.0
                };
            }
            this.soundManager.play('hit');
        }

        this.ball.inPlay = false;
        this.ball.wasHit = true;
    }

    handleWicketHit() {
        if (this.wickets.hit()) {
            this.gameState.setGameOver();
        }
        this.gameState.updateWickets(this.wickets.remaining);
        this.ball.inPlay = false;
        this.soundManager.play('wicket');
    }

    updateScore() {
        document.getElementById('score').textContent = `Score: ${this.gameState.score}`;
    }

    updateWickets() {
        document.getElementById('wickets').textContent = `Wickets: ${this.gameState.wicketsLeft}`;
    }

    gameOver() {
        document.getElementById('gameOver').classList.remove('hidden');
        document.getElementById('finalScore').textContent = this.gameState.score;
    }
}

window.onload = () => {
    new CricketGame();
};
