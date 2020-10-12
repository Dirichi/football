import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  // position selected on click of the view
  position;

  // playable positions
  positions = [
    'striker',
    'midfielder',
    'defender'
  ];

  // select position
  select(position){
    // select the position
    this.position = position;
    window.alert(position);
  }

  constructor() { }

  ngOnInit(): void {
  }

}
