# Cricket Game API Documentation

## Classes

### CricketGame
Main game controller class.

#### Methods
- `constructor()` - Initializes game
- `update()` - Updates game state
- `draw()` - Renders game frame

### Ball
Handles ball physics and rendering.

#### Properties
- `inPlay: boolean` - Ball active state
- `type: string` - Ball type (YORKER, BOUNCER, etc.)

#### Methods
- `reset(power: number, type: string)` - Reset ball state
- `update()` - Update ball position
