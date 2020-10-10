import { Component, OnInit} from '@angular/core';
import { Console } from 'console';
@Component({
  selector: 'app-tips',
  templateUrl: './tips.component.html',
  styleUrls: ['./tips.component.css']
})

export class TipsComponent implements OnInit {


  // hard coded tips
  tips = [
    'Use direction (Arrow Keys) to move...',
    'Press A to shoot...',
    'Press S to pass...',
    'Press D to request a pass. (only works on non-player characters)...',
    'Press F to chase after the ball...'
  ];



  // get the current tipIndes
  currentTipIndex = 0;
  currentTip;

  // select tip
  selectTip(){
    // get the current tip
    this.currentTip  =  this.tips[this.currentTipIndex];


    // update the display (pass the current index )
    this.updateDisplay(this.currentTip, this.currentTipIndex);

    // increment the value of the tipIndex
    this.currentTipIndex++;

    // range check (return current tip index to zero if it exceeds limit)
    if(this.currentTipIndex>this.tips.length - 1) this.currentTipIndex = 0;

  }


  // update the display
  updateDisplay(tip, tipIndex){

    // find the container or element who's value is equal to the tip index and put  the word in that one



    // define the current index of the character being displayed
    let characterIndex = 0 ;
    // define word to be what is being displayed
    let word = '';


    // set interval for attaching / displaying the word
    const attachCharacter = setInterval(() => {
      word += tip[characterIndex];
      // display the word
      document.querySelector('[data-testOutput]').innerHTML = word ;
      // increment the value of the characterIndex
      characterIndex ++ ;
      // range check
      if (characterIndex > tip.length - 1){
        //  clear the interval
          clearInterval(attachCharacter);
          characterIndex = 0;
        }
    } , 100 );



  }

  constructor() { }

  ngOnInit(): void {
    // select the tip

    // set an interval
    setInterval(() => this.selectTip(),7000)

    this.selectTip();
  }

  ngAfterViewInit(): void {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.

  }




}
