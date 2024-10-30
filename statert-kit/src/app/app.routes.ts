import { Routes } from '@angular/router';
import { ContentComponent } from './shared/component/layout/content/content.component';
import { dashData } from './shared/routes/routes';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/pages/sample-page1',
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    component: LoginComponent,
  },
  {
    path: '',
    component: ContentComponent,
    children: dashData
  },
];
