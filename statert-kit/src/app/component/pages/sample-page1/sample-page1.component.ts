import { Component } from '@angular/core';
import { SamplePageComponent } from '../../sample-page/sample-page.component';

@Component({
  selector: 'app-sample-page1',
  standalone: true,
  imports: [SamplePageComponent],
  templateUrl: './sample-page1.component.html',
  styleUrl: './sample-page1.component.scss'
})
export class SamplePage1Component {

}
