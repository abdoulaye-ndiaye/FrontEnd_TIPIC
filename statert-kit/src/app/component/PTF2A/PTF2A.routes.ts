import { Routes } from "@angular/router";
import { AjoutAnalyseSensorielleComponent } from "./ajout-analyse-sensorielle/ajout-analyse-sensorielle.component";
import { ListeEchantillonsComponent } from "./liste-echantillons/liste-echantillons.component";
export const PTF2A: Routes = [
    {
        path: "",
        children: [
            {
                path: "ajout-analyse-sensorielle",
                component: AjoutAnalyseSensorielleComponent,
                data: {
                    title: "Ajout Analyse Sensorielle",
                    breadcrumb: "Ajout Analyse Sensorielle",
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
