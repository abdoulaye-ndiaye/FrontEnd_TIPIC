import { Routes } from "@angular/router";
import { FormulaireIdentiteComponent } from "./formulaire-identite/formulaire-identite.component";
import { ListeEchantillonsComponent } from "./liste-echantillons/liste-echantillons.component";

export const syndicat: Routes = [
    {
        path: "",
        children: [
            {
                path: "formulaire-identite",
                component: FormulaireIdentiteComponent,
                data: {
                    title: "Formulaire Identite",
                    breadcrumb: "Formulaire Identite",
                },
            },
            {
                path: "liste-echantillons",
                component: ListeEchantillonsComponent,
                data: {
                    title: "Liste Echantillons",
                    breadcrumb: "Liste Echantillons",
                },
            },
        ],
    },
];
