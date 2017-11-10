import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-404-error',
  template: '<h1>\n Error: 404: Resource not found.\n </h1>\n',
})
export class Error404Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
