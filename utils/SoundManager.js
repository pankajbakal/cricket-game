export class SoundManager {
    constructor() {
        this.sounds = {
            hit: 'data:audio/wav;base64,UklGRl9vT19AAElGRgAAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgA',
            wicket: 'data:audio/wav;base64,UklGRl9vT19AAElGRgAAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgA'
        };
    }

    play(type) {
        const audio = new Audio(this.sounds[type]);
        audio.play().catch(() => {});
    }
}
