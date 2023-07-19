# vue-slot-machine
this project is a simple slot machine game created using Vue.js and GSAP. The game involves clicking a lever to spin three blocks, which will stop and reveal symbols. If all three symbols are the same, the player earns credits, which can be used to play again or cash out.

## Overview
When a player starts a game, they are allocated 10 credits. Pulling the machine lever (rolling the slots) costs 1 credit. The game screen has 1 row with 3 blocks. For player to win the roll, they have to get the same symbol in each block. There are 4 possible symbols: cherry, lemon, orange, and watermelon with respective rewards.

## Installation
```
# Clone the repo
git clone https://github.com/pouryasanboy/vue-slot-machine.git

# Navigate into the directory
cd slot-machine-game

# Install dependencies
npm install

# Start the application
npm run serve
```

## How to Play
Open the application in your web browser.
Click the "Start" button to start the game.
Each roll costs 1 credit.
If the symbols in all blocks match, you win and your credits increase by the symbol's reward amount.
To stop the game and cash out your credits, click on the "CASH OUT" button.

## Implementation
The game's logic is encapsulated in the SlotMachine Vue component. This component handles the game state, such as the player's current credits and the current symbols in the slot machine blocks. The game logic is primarily implemented in the pullLever and shouldReroll methods.

## Testing
To run the test suite, run:
```
npm run test
```
This will run all the tests in the tests directory. The tests are written using [Jest ↗](https://jestjs.io/).

## License
This project is licensed under the MIT License.
