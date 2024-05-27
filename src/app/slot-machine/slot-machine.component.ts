import { Component, OnInit } from '@angular/core';
import { Observer } from 'rxjs';
import { ExchangeRateService } from 'src/services/exhange-rate.service';


@Component({
  selector: 'app-slot-machine',
  templateUrl: './slot-machine.component.html',
  styleUrls: ['./slot-machine.component.scss'],
})
export class SlotMachineComponent implements OnInit {
  items: string[] = ['🍒', '🍋', '🔔', '🍀', '⭐', '🍇', '🍉'];
  displayedItems: string[] = ['🍒', '🍋', '🔔'];
  credits: number = 100;
  spinCost: number = 10;
  winningAmount: number = 50;
  isSpinning: boolean = false;
  isWinner: boolean = false;
  result: string = '';
  resultColor: string = 'white';
  leverPulls: number = 0;
  leverTransform: string = 'translateY(0)';
  exchangeRate: number = 0;

  constructor(private exchangeRateService: ExchangeRateService) { }

  ngOnInit(): void {
    this.fetchExchangeRate();
  }

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

  getWeightedRandomItem(): string {
    // Increase the probability of winning items
    const weightedItems: string[] = [
      '🍒', '🍒', '🍒', '🍒',
      '🍋', '🍋', '🍋',
      '🔔', '🔔',
      '🍀', '🍀',
      '⭐',
      '🍇',
      '🍉'
    ];
    const randomIndex = Math.floor(Math.random() * weightedItems.length);
    return weightedItems[randomIndex];
  }

  fetchExchangeRate(): void {
    const exchangeRateObserver: Observer<any> = {
      next: data => this.exchangeRate = data.rates.CAD,
      error: err => console.error('Error fetching exchange rate', err),
      complete: () => console.log('Exchange rate fetch complete')
    };

    this.exchangeRateService.getExchangeRate().subscribe(exchangeRateObserver);
  }
}
