import { Routes } from "@angular/router";
import { AjoutSiftMsComponent } from "./ajout-sift-ms/ajout-sift-ms.component";
import { ListeEchantillonsComponent } from "./liste-echantillons/liste-echantillons.component";
import { UpdateSiftMsComponent } from "./update-sift-ms/update-sift-ms.component";

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
            {
                path: "update-sift-ms",
                component: UpdateSiftMsComponent,
                data: {
                    title: "Update SIFT-MS",
                    breadcrumb: "Update SIFT-MS",
                },
            }
        ],
    },
];
