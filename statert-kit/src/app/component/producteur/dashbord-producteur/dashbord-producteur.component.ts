import { Component, Input, OnInit } from "@angular/core";
import { jwtDecode } from "jwt-decode";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgApexchartsModule } from "ng-apexcharts";
import {
    ApexNonAxisChartSeries,
    ApexPlotOptions,
    ApexChart,
    ApexLegend,
    ApexResponsive,
    ApexStroke,
    ApexXAxis,
    ApexYAxis,
    ApexFill,
    ApexDataLabels,
    ApexAxisChartSeries,
    ApexMarkers,
    ApexTheme,
    ApexTitleSubtitle,
    ApexAnnotations,
    ApexGrid,
} from "ng-apexcharts";
import { FromageService } from "../../../services/fromage.service";
import { UtilisateurService } from "../../../services/utilisateur.service";

export type ChartOptions = {
    series?: ApexAxisChartSeries;
    chart?: ApexChart;
    xaxis?: ApexXAxis;
    stroke?: ApexStroke;
    tooltip?: string[] | boolean;
    dataLabels?: ApexDataLabels;
    yaxis?: ApexYAxis;
    legend?: ApexLegend;
    labels?: string[];
    shared?: boolean;
    plotOptions?: ApexPlotOptions;
    fill?: ApexFill;
    responsive?: ApexResponsive[];
    pieseries?: ApexNonAxisChartSeries;
    title?: ApexTitleSubtitle;
    theme?: ApexTheme;
    colors?: string[];
    markers?: ApexMarkers;
    annotations?: ApexAnnotations;
    grid?: ApexGrid;
    formatter?: Function;
};

let primary_color = localStorage.getItem("primary_color") || "#5C61F2";
let secondary_color = localStorage.getItem("secondary_color") || "#FF9766";

@Component({
    selector: "app-dashbord-producteur",
    standalone: true,
    imports: [CommonModule, RouterModule, NgApexchartsModule],
    templateUrl: "./dashbord-producteur.component.html",
    styleUrl: "./dashbord-producteur.component.scss",
})
export class DashbordProducteurComponent {
    @Input() TotalEchantillon: ChartOptions | any = {
        series: [
            {
                name: "Desktops",
                data: [
                    50, 50, 50, 25, 25, 25, 2, 2, 2, 25, 25, 25, 62, 62, 62, 35,
                    35, 35, 66, 66,
                ],
            },
        ],
        chart: {
            height: 100,
            type: "area",
            zoom: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
            dropShadow: {
                enabled: true,
                top: 5,
                left: 0,
                bottom: 3,
                blur: 2,
                color: "#44A8D7",
                opacity: 0.2,
            },
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.5,
                opacityTo: 0.1,
                stops: [0, 90, 100],
            },
        },
        tooltip: {
            enabled: false,
        },
        dataLabels: {
            enabled: false,
        },
        grid: {
            show: false,
        },
        xaxis: {
            labels: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        yaxis: {
            show: false,
        },
        stroke: {
            curve: "straight",
            width: 2,
        },
        markers: {
            discrete: [
                {
                    seriesIndex: 0,
                    dataPointIndex: 12,
                    fillColor: "#44A8D7",
                    strokeColor: "#44A8D7",
                    size: 5,
                    shape: "circle",
                },
            ],
        },

        title: "Total Echantillon",
        class: "total-product",
        chartclass: "total-product-chart",
        price: "7",
        arrowicon: "arrow-chart-up",
        icon: "Product",
        percentage: "+42%",
        color: "success",
    };

    constructor(
        private fromageService: FromageService,
        private utilisateurService: UtilisateurService
    ) {}
    nom: string;
    prenom: string;
    decodedToken: any;
    codeProducteur: string;

    ngOnInit(): void {
        const token = localStorage.getItem("token") as string;
        this.decodedToken = jwtDecode(token);
        //console.log(this.decodedToken);
        this.nom = this.decodedToken.user.nom;
        this.prenom = this.decodedToken.user.prenom;
        this.utilisateurService.getById(this.decodedToken.user._id).subscribe(
            (response) => {
                //console.log(response);
                this.codeProducteur = response.codeProducteur;
                this.fetchEchantillonsProducteur(this.codeProducteur);
            },
            (error) => {
                console.error(
                    "Erreur lors de la récupération de l'utilisateur",
                    error
                );
            }
        );
    }

    fetchEchantillonsProducteur(codeProducteur: string): void {
        this.fromageService.getAll().subscribe(
            (response: any[]) => {
                // Filtrer les échantillons pour ce producteur
                const echantillonsProducteur = response.filter(
                    (echantillon) =>
                        echantillon.codeProducteur === codeProducteur
                );

                // Mettre à jour le tableau de bord
                this.TotalEchantillon.price = echantillonsProducteur.length;
                this.TotalEchantillon.percentage = "+5%"; // Exemple de mise à jour dynamique.
            },
            (error) => {
                console.error(
                    "Erreur lors de la récupération des échantillons du producteur",
                    error
                );
            }
        );
    }
}
