import { Routes } from "@angular/router";
import { FormulaireIdentiteComponent } from "./formulaire-identite/formulaire-identite.component";
import { ListeEchantillonsComponent } from "./liste-echantillons/liste-echantillons.component";
import { DetailsEchantillonComponent } from "./details-echantillon/details-echantillon.component";
import { UpdateEchantillonComponent } from "./update-echantillon/update-echantillon.component";
import { Role } from "../../shared/services/models/Role";
import { authGuard } from "../../guard/auth.guard";


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
            {
                path: "details-echantillon",
                component: DetailsEchantillonComponent,
                data: {
                    title: "Details Echantillon",
                    breadcrumb: "Details Echantillon",
                    expectedRoles: [Role.SYNDICAT_AOP, Role.CHEF_PROJET_IPREM, Role.INGENIEUR_IPREM, Role.TECHNICIEN_IPREM, Role.ADMIN],  
                },
                canActivate: [authGuard],
            },
            {
                path: "update-echantillon",
                component: UpdateEchantillonComponent,
                data: {
                    title: "Update Echantillon",
                    breadcrumb: "Update Echantillon",
                },
            },
        ],
    },
];
