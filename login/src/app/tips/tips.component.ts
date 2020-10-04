import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tips',
  templateUrl: './tips.component.html',
  styleUrls: ['./tips.component.css']
})
export class TipsComponent implements OnInit {


  // hard coded tips
  tips = [
    'Use direction (Arrow) keys to move.',
    'Press A to shoot.',
    'Press S to pass.',
    'Press D to request a pass. (only works on non-player characters)',
    'Press F to chase after the ball.'
  ];

  // current tip Index
  currentTipIndex = 0;
  // current tip
  currentTip;


  // select Tip
  selectTip(){
    this.currentTip = this.tips[this.currentTipIndex];
    // call the update display method...
    this.updateDisplay();

    // increment the value of the current Tip Index
    this.currentTipIndex ++;

    // ensure that the  current Tip index doesnt go out of range
    if (this.currentTipIndex > this.tips.length - 1) {this.currentTipIndex = 0; }
  }

  // update Display
  updateDisplay(){
    // letter index
    let letterIndex = 0;
    // write the tip letter by letter (timer function)
    this.currentTip.split().forEach((tip) => {
      // append the  current letter to the the screen
      document.querySelector('[data-displayScreen]').innerHTML += tip[letterIndex];
    });


  }


  constructor() { }

  ngOnInit(): void {
    setInterval(() => {
      this.selectTip();
    }, 2000);
    this.selectTip();
  }

}
