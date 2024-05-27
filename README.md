# Ionic Slot Machine Game

Welcome to Slot Machine Game! This project is a simple and fun slot machine game built using Ionic and Angular. Pull the lever, watch the reels spin, and see if you hit the jackpot!


## Features

- **Spinning Reels**: Enjoy the animated spinning reels for a realistic slot machine experience.
- **Winning Logic**: Win credits when the reels align with the same items.
- **Credits System**: Start with a set amount of credits, and each pull costs credits. Win more credits by hitting the jackpot.
- **Visual Feedback**: Dynamic feedback on your win or loss with changing colors.

## Screenshots
<img width="200" alt="Screenshot 2024-05-27 at 4 30 06 AM" src="https://github.com/nrvjj008/slot-machine-ionic/assets/11418936/4b944af8-7c5f-41f6-8575-e23ebe5a8a6f">
<img width="200" alt="Screenshot 2024-05-27 at 4 30 24 AM" src="https://github.com/nrvjj008/slot-machine-ionic/assets/11418936/b58e34cd-3f24-4bf1-aa97-306b5d2b0131">
<img width="200" alt="Screenshot 2024-05-27 at 4 31 13 AM" src="https://github.com/nrvjj008/slot-machine-ionic/assets/11418936/4b7e2d2b-aede-4a46-a928-02895be23bc0">

## Installation

Follow these steps to set up and run the project locally.

1. **Clone the repository**

    ```bash
    git clone https://github.com/your-username/slot-machine-game.git
    cd slot-machine-game
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Run the application**

    ```bash
    ionic serve
    ```

## Usage

1. **Pull the Lever**: Click on the lever to start spinning the reels.
2. **Watch the Reels Spin**: Enjoy the spinning animation and wait for the final result.
3. **Check Your Credits**: Keep an eye on your credits and see if you win more!

## Code Overview

### Component Structure

- **SlotMachineComponent**: The main component handling the game logic and UI.
  - **pullLever()**: Handles the spinning logic and updates the UI.
  - **getWeightedRandomItem()**: Returns a weighted random item for the reels.

### Styles

- **CSS Animations**: The project uses CSS animations for the spinning effect and visual feedback.

### Example

```typescript
pullLever(): void {
    this.result = 'Spinning...';
    this.resultColor = 'orange';
    this.leverTransform = 'translateY(55px)';
    console.log('Pulling lever...');
    if (this.credits < this.spinCost || this.isSpinning) {
      this.result = 'Not enough credits!';
      this.leverTransform = 'translateY(0)';
      return;
    }

    this.isSpinning = true;
    this.isWinner = false;
    this.credits -= this.spinCost;
    this.leverPulls++;

    // Rapidly change items to create a spinning effect
    const spinInterval = setInterval(() => {
      this.displayedItems = this.displayedItems.map(() => this.getWeightedRandomItem());
    }, 100); // Change items every 100ms

    setTimeout(() => {
      clearInterval(spinInterval); // Stop spinning
      this.isSpinning = false;
      this.leverTransform = 'translateY(0)';

      if (this.leverPulls % 3 === 0) {
        this.displayedItems = new Array(3).fill(this.items[Math.floor(Math.random() * this.items.length)]);
        this.credits += this.winningAmount;
        this.isWinner = true;
        this.result = 'You win ' + this.winningAmount + ' credits!';
        this.resultColor = 'green';
      } else {
        if (this.displayedItems.every((item, _, arr) => item === arr[0])) {
          this.credits += this.winningAmount;
          this.isWinner = true;
          this.result = 'You win ' + this.winningAmount + ' credits!';
          this.resultColor = 'green';
        } else {
          this.result = 'Try again!';
          this.resultColor = 'red';
        }
      }
    }, 3000); // Spin for 3 seconds
}
