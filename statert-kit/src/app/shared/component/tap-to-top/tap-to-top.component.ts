import { ViewportScroller } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FeathericonComponent } from '../feathericon/feathericon.component';

@Component({
  selector: 'app-tap-to-top',
  standalone: true,
  imports: [FeathericonComponent],
  templateUrl: './tap-to-top.component.html',
  styleUrl: './tap-to-top.component.scss'
})
export class TapToTopComponent {

  public isShow: boolean = false;

  constructor(private viewScroller: ViewportScroller) { }

  @HostListener("window:scroll", [])

  onWindowScroll() {
    let number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (number > 400) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }

  tapToTop() {
    this.viewScroller.scrollToPosition([0, 0]);

  }
}
