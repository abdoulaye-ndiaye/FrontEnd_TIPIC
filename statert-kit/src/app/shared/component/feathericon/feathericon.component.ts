import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import * as feather from 'feather-icons';

@Component({
  selector: 'app-feather-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feathericon.component.html',
  styleUrl: './feathericon.component.scss'
})
export class FeathericonComponent {

  @Input('icon') public icon: string | undefined;

  ngAfterViewInit() {
    feather.replace();
  }

}
