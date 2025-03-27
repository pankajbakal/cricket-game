import { GameProbability } from './utils/GameProbability.js';

class Game {
    // ...existing code...
    
    handleBat() {
        const playerSkill = this.player.skill || 0.5;
        
        if (GameProbability.isWicket(playerSkill)) {
            this.wicket();
            return;
        }
        
        if (GameProbability.getHitProbability(playerSkill)) {
            const runs = GameProbability.getRunsScored();
            this.addRuns(runs);
        }
    }
    
    checkCollision(ball, bat) {
        // First check if ball is even in the batting zone
        if (!this.isInBattingZone(ball)) {
            return false;
        }

        // Even if bat is in position, player might miss
        if (!this.attemptBatting()) {
            return false;
        }

        return this.isInHitArea(ball, this.getBatHitArea(bat));
    }

    isInBattingZone(ball) {
        const BATTING_ZONE_WIDTH = 20;
        const BATTING_ZONE_HEIGHT = 60;
        
        return ball.x >= this.battingPosition.x && 
               ball.x <= this.battingPosition.x + BATTING_ZONE_WIDTH &&
               ball.y >= this.battingPosition.y && 
               ball.y <= this.battingPosition.y + BATTING_ZONE_HEIGHT;
    }

    attemptBatting() {
        const playerSkill = this.player.skill || 0.5;
        const movementPenalty = this.isPlayerMoving ? 0.3 : 0;
        const effectiveSkill = Math.max(0.1, playerSkill - movementPenalty);

        // Even standing still doesn't guarantee a hit
        return GameProbability.isBatConnected(effectiveSkill);
    }

    getBatHitArea(bat) {
        // Reduce hit area if player is moving
        const baseWidth = this.isPlayerMoving ? 5 : 10;
        const baseHeight = this.isPlayerMoving ? 30 : 50;

        return {
            x: bat.x,
            y: bat.y,
            width: baseWidth,
            height: baseHeight
        };
    }

    calculateBatHitArea(ball, batArea) {
        // Reduce effective bat area based on timing
        const timingOffset = Math.abs(this.getBatSwingTiming());
        const effectiveWidth = batArea.width * (1 - timingOffset);
        const effectiveHeight = batArea.height * (1 - timingOffset);

        return {
            x: batArea.x + (batArea.width - effectiveWidth) / 2,
            y: batArea.y + (batArea.height - effectiveHeight) / 2,
            width: effectiveWidth,
            height: effectiveHeight
        };
    }

    isInHitArea(ball, hitArea) {
        return ball.x < hitArea.x + hitArea.width &&
               ball.x + ball.radius > hitArea.x &&
               ball.y < hitArea.y + hitArea.height &&
               ball.y + ball.radius > hitArea.y;
    }

    getBatSwingTiming() {
        // Return value between 0 (perfect) and 1 (completely off)
        // Based on when player pressed the bat button vs ideal hitting time
        return Math.abs(this.idealHitTime - this.playerHitTime) / this.maxTimingWindow;
    }
    
    wicket() {
        this.wickets++;
        // Add wicket animation or display logic here
        if (this.wickets >= this.maxWickets) {
            this.gameOver();
        }
    }
    
    addRuns(runs) {
        this.score += runs;
        // Add score update animation or display logic here
    }
    
    // ...existing code...
}