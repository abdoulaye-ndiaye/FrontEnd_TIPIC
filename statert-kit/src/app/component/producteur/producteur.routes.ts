import { Routes } from '@angular/router';
import { DashbordProducteurComponent } from './dashbord-producteur/dashbord-producteur.component';

export const producteur: Routes = [
    {
        path: '',
        children: [
          {
            path: 'dashboard-producteur',
            component: DashbordProducteurComponent,
            data: {
              title: "Dashboard Producteur",
              breadcrumb: "Dashboard Producteur",
            }
          },
        ]
    }
];