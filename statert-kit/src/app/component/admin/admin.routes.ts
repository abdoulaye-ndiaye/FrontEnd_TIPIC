import { Routes } from '@angular/router';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { RegisterComponent } from './register/register.component';
import { UtilisateurComponent } from './utilisateur/utilisateur.component';
import { UpdateUtilisateurComponent } from './update-utilisateur/update-utilisateur.component';

export const admin: Routes = [
    {
        path: '',
        children: [
          {
            path: 'dashboard',
            component: DashboardAdminComponent,
            data: {
              title: "Dashboard",
              breadcrumb: "Dashboard",
            }
          },
          {
            path: 'register',
            component: RegisterComponent,
            data: {
              title: "Register",
              breadcrumb: "Register",
            }
          },
          {
            path: 'utilisateur',
            component: UtilisateurComponent,
            data: {
              title: "Utilisateur",
              breadcrumb: "Utilisateur",
            }
          },
          {
            path:'update-utilisateur',
            component:UpdateUtilisateurComponent,
            data: {
              title:"Mettre à jour Utilisateur",
              Breadcrumb: "Mettre à jour Utilisateur"
            }
          }
        ]
      }
]
