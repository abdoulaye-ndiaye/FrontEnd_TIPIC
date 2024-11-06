import { Routes } from "@angular/router";
import { AjoutSiftMsComponent } from "./ajout-sift-ms/ajout-sift-ms.component";
import { ListeEchantillonsComponent } from "./liste-echantillons/liste-echantillons.component";
export const iprem: Routes = [
    {
        path: "",
        children: [
            {
                path: "ajout-sift-ms",
                component: AjoutSiftMsComponent,
                data: {
                    title: "Ajout SIFT-MS",
                    breadcrumb: "Ajout SIFT-MS",
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
