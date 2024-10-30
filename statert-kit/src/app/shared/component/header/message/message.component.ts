import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SvgIconComponent } from '../../svg-icon/svg-icon.component';
import { FeathericonComponent } from '../../feathericon/feathericon.component';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [SvgIconComponent,RouterModule,CommonModule,FeathericonComponent],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {

  public messages:boolean =false;

  message(){
    this.messages != this.messages
  }

}
