import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SvgIconComponent } from '../../svg-icon/svg-icon.component';

import { LayoutService } from '../../../services/layout.service';

@Component({
  selector: 'app-mode',
  standalone: true,
  imports: [SvgIconComponent, CommonModule],
  templateUrl: './mode.component.html',
  styleUrl: './mode.component.scss'
})
export class ModeComponent {

  public dark: boolean = this.layout.config.settings.layout_version == 'dark-only' ? true : false;

  constructor(public layout: LayoutService) { }

  layoutToggle() {
    this.dark = !this.dark;
    this.dark
      ? document.body.classList.add('dark-only')
      : document.body.classList.remove('dark-only');
    this.layout.config.settings.layout_version = this.dark
      ? 'dark-only'
      : 'light-only';

  }

  ngOnInit(): void { }

}
