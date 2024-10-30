import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SvgIconComponent } from '../../svg-icon/svg-icon.component';

@Component({
  selector: 'app-notifactions',
  standalone: true,
  imports: [SvgIconComponent,RouterModule,CommonModule],
  templateUrl: './notifactions.component.html',
  styleUrl: './notifactions.component.scss'
})
export class NotifactionsComponent {

  public notifications: boolean = false;

  notification() {
    this.notifications = !this.notifications
  }

}
