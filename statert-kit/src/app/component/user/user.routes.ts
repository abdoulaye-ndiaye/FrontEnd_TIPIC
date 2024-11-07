import { Routes } from '@angular/router';
import { ProfilComponent } from './profil/profil.component';
export const user: Routes = [
    {
        path: '',
        children: [
          {
            path: 'profile',
            component: ProfilComponent,
            data: {
              title: "Profil",
              breadcrumb: "Profil",
            }
        }
        ]
      }
]
