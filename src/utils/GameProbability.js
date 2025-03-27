export class GameProbability {
    static getHitProbability(skill = 0.5) {
        const BASE_HIT_CHANCE = 0.5; // Reduced from 0.7
        return Math.random() < (BASE_HIT_CHANCE * skill);
    }

    static getRunsScored() {
        const runs = [0, 1, 2, 3, 4, 6];
        const probabilities = [0.35, 0.25, 0.2, 0.1, 0.07, 0.03]; // Adjusted to make scoring harder
        const random = Math.random();
        let sum = 0;
        
        for (let i = 0; i < probabilities.length; i++) {
            sum += probabilities[i];
            if (random <= sum) return runs[i];
        }
        return 0;
    }

    static isWicket(skill = 0.5) {
        const BASE_WICKET_CHANCE = 0.25; // Increased from 0.15
        const MINIMUM_WICKET_CHANCE = 0.1; // Ensures even skilled players can get out
        return Math.random() < Math.max(BASE_WICKET_CHANCE * (1 - skill), MINIMUM_WICKET_CHANCE);
    }

    static isBatConnected(skill = 0.5) {
        const BASE_CONNECT_CHANCE = 0.5; // Reduced from 0.7
        const MINIMUM_MISS_CHANCE = 0.3; // Increased from 0.2
        const RANDOM_FACTOR = Math.random() * 0.2; // Add some unpredictability
        
        const connectChance = (BASE_CONNECT_CHANCE * skill) - RANDOM_FACTOR;
        return Math.random() < Math.min(connectChance, 1 - MINIMUM_MISS_CHANCE);
    }
}
