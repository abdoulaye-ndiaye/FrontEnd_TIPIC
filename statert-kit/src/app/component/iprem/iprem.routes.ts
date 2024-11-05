import { Routes } from "@angular/router";
import { AjoutSiftMsComponent } from "./ajout-sift-ms/ajout-sift-ms.component";
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
           
        ],
    },
];
