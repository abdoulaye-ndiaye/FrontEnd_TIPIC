import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { FeathericonComponent } from '../../feathericon/feathericon.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FeathericonComponent, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  public show: boolean = false;

  constructor(private router: Router) { }

  open() {
    this.show = !this.show
  }

}
