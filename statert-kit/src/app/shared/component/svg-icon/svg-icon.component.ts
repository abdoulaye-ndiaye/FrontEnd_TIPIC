import { Component, Input } from '@angular/core';

import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-svg-icon',
  standalone: true,
  imports: [],
  templateUrl: './svg-icon.component.html',
  styleUrl: './svg-icon.component.scss'
})
export class SvgIconComponent {

  @Input("icon") public icon: string | undefined;

  constructor(public layoutService: LayoutService) { }

}
