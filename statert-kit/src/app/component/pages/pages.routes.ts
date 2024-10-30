import { Routes } from '@angular/router';
import { SamplePage1Component } from './sample-page1/sample-page1.component';
import { SamplePage2Component } from './sample-page2/sample-page2.component';

export const pages: Routes = [
    {
        path: '',
        children: [
          {
            path: 'sample-page1',
            component: SamplePage1Component,
            data: {
              title: "Sample-page1",
              breadcrumb: "Default",
            }
          },
          {
            path: 'sample-page2',
            component: SamplePage2Component,
            data: {
              title: "Sample-page2",
              breadcrumb: "Sample-page2",
            }
          },
        ]
      }
]
