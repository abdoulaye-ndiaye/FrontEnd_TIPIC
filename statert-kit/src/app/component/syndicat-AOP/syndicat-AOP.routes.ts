import { Routes } from '@angular/router';
import { FormulaireIdentiteComponent } from './formulaire-identite/formulaire-identite.component';

export const syndicat: Routes = [
    {
        path: '',
        children: [
          {
            path: 'formulaire-identite',
            component: FormulaireIdentiteComponent,
            data: {
                title: "Formulaire Identite",
                breadcrumb: "Formulaire Identite",
                }
          },
          
        ]
      }
]
