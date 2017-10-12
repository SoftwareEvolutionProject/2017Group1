import {AfterViewInit, Component, OnInit} from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent implements OnInit, AfterViewInit {

  private trigger;
  private isClosed : boolean = false;

  constructor() { }

  ngOnInit() {  }


  ngAfterViewInit(): void {

    this.trigger = $('.hamburger');

    let _self = this;
    this.trigger.click(function () {
      _self.hamburger_cross();
    });

    $('[data-toggle="offcanvas"]').click(function () {
      $('#wrapper').toggleClass('toggled');
    });
  }


  hamburger_cross() {

    if (this.isClosed == true) {
      this.trigger.removeClass('is-open');
      this.trigger.addClass('is-closed');
      this.isClosed = false;
    } else {
      this.trigger.removeClass('is-closed');
      this.trigger.addClass('is-open');
      this.isClosed = true;
    }
  }

}
