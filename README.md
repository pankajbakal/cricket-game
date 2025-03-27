# Cricket Game

A browser-based cricket game built using HTML5 Canvas. Experience the excitement of cricket with this interactive game.

## Features

- HTML5 Canvas-based gaming experience
- Real-time gameplay mechanics
- Modern JavaScript implementation
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/pankajbakal/cricket-game.git
cd cricket-game
```

2. Install dependencies:
```bash
npm install
```

## Development

Run the development server:
```bash
npm run dev
```

The game will be available at `http://localhost:8080`

## Scripts

- `npm run dev` - Start development server
- `npm start` - Start lite-server
- `npm run build` - Build for production
- `npm run clean` - Clean build directories
- `npm test` - Run tests

## Building for Production

```bash
npm run build
```

The built files will be available in the `dist` directory.

## Tech Stack

- HTML5 Canvas
- JavaScript (ES6+)
- Webpack
- Babel
- Core.js

## Game Mechanics

### Batting System
- Hit probability is based on player skill level
- Possible runs: 0, 1, 2, 3, 4, and 6
- Run distribution follows realistic cricket probabilities
- Wicket chance increases with lower skill levels

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Pankaj Bakal

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
