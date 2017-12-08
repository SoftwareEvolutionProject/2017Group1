import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-500-error',
  template: '<h1>\n Error: 500: internal server error. Contact The Administrator, or try again later.\n </h1>\n',
})
export class Error500Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
