export class GameState {
    constructor() {
        this.score = 0;
        this.isGameOver = false;
        this.scoreElement = document.getElementById('score');
        this.wicketsElement = document.getElementById('wickets');
        this.gameOverElement = document.getElementById('gameOver');
        this.finalScoreElement = document.getElementById('finalScore');
    }

    updateScore(points) {
        if (points > 0) {
            this.score += points;
            if (this.scoreElement) {
                this.scoreElement.textContent = `Score: ${this.score}`;
            }
            // Debug log to verify scoring
            console.log(`Score updated: +${points}, Total: ${this.score}`);
        }
    }

    updateWickets(remaining) {
        this.wicketsElement.textContent = `Wickets: ${remaining}`;
    }

    setGameOver() {
        this.isGameOver = true;
        this.gameOverElement.classList.remove('hidden');
        this.finalScoreElement.textContent = this.score;
    }

    reset() {
        this.score = 0;
        this.isGameOver = false;
        this.updateScore(0);
        this.gameOverElement.classList.add('hidden');
    }
}
