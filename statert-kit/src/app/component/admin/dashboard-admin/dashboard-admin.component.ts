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
import { UtilisateurService } from "../../../services/utilisateur.service";
import { FromageService } from "../../../services/fromage.service";

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
    selector: "app-dashboard-admin",
    standalone: true,
    imports: [CommonModule, RouterModule, NgApexchartsModule],
    templateUrl: "./dashboard-admin.component.html",
    styleUrl: "./dashboard-admin.component.scss",
})
export class DashboardAdminComponent implements OnInit {
    @Input() TotalUtilisateur: ChartOptions | any = {
        series: [
            {
                name: "Desktops",
                data: [10, 35, 15, 78, 40, 60, 12, 60],
            },
        ],
        chart: {
            type: "area",
            height: 120,
            offsetY: 50,
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
                color: "#61AE41",
                opacity: 0.2,
            },
        },
        colors: ["#61AE41"],
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.6,
                opacityTo: 0.2,
                stops: [0, 100, 100],
            },
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
        tooltip: {
            custom: function ({ series, seriesIndex, dataPointIndex }: any) {
                return (
                    '<div class="apex-tooltip p-2">' +
                    "<span>" +
                    '<span class="bg-primary">' +
                    "</span>" +
                    "customer" +
                    "<h3>" +
                    "$" +
                    series[seriesIndex][dataPointIndex] +
                    "<h3/>" +
                    "</span>" +
                    "</div>"
                );
            },
        },

        title: "Utilisateurs",
        class: "total-customer",
        chartclass: "customer-chart",
        price: "0",
        arrowicon: "arrow-chart-up",
        icon: "Customer",
        percentage: "+24%",
        color: "success",
    };

    @Input() TotalProducteur: ChartOptions | any = {
        series: [
            {
                name: "Desktops",
                data: [10, 35, 15, 78, 40, 60, 12, 60],
            },
        ],
        chart: {
            type: "area",
            height: 120,
            offsetY: 50,
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
                color: "#61AE41",
                opacity: 0.2,
            },
        },
        colors: ["#61AE41"],
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.6,
                opacityTo: 0.2,
                stops: [0, 100, 100],
            },
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
        tooltip: {
            custom: function ({ series, seriesIndex, dataPointIndex }: any) {
                return (
                    '<div class="apex-tooltip p-2">' +
                    "<span>" +
                    '<span class="bg-primary">' +
                    "</span>" +
                    "customer" +
                    "<h3>" +
                    "$" +
                    series[seriesIndex][dataPointIndex] +
                    "<h3/>" +
                    "</span>" +
                    "</div>"
                );
            },
        },

        title: "Producteurs",
        class: "total-customer",
        chartclass: "customer-chart",
        price: "0",
        arrowicon: "arrow-chart-up",
        icon: "Customer",
        percentage: "0",
        color: "success",
    };

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

        title: "Echantillons",
        class: "total-product",
        chartclass: "total-product-chart",
        price: "0",
        arrowicon: "arrow-chart-up",
        icon: "Product",
        percentage: "0",
        color: "success",
    };

    constructor(
        private fromageService: FromageService,
        private utilisateurService: UtilisateurService
    ) {}
    nom: string;
    prenom: string;
    decodedToken: any;
    utilisateurs: any[] = [];
    totalProducteurs: number = 0;

    ngOnInit(): void {
        const token = localStorage.getItem("token") as string;
        this.decodedToken = jwtDecode(token);
        //console.log(this.decodedToken);
        this.nom = this.decodedToken.user.nom;
        this.prenom = this.decodedToken.user.prenom;
        this.fetchTotalUtilisateurs();
        this.fetchTotalEchantillons();
        this.loadUtilisateurs();
    }

    fetchTotalUtilisateurs() {
        this.utilisateurService.getAll().subscribe(
            (response) => {
                this.TotalUtilisateur.price = response.length;
                this.TotalUtilisateur.percentage = "+5%"; // Exemple de mise à jour dynamique.
            },
            (error) => {
                console.error(
                    "Erreur lors de la récupération des utilisateurs",
                    error
                );
            }
        );
    }

    fetchTotalEchantillons() {
        this.fromageService.getAll().subscribe(
            (response) => {
                this.TotalEchantillon.price = response.length;
                this.TotalEchantillon.percentage = "+5%"; // Exemple de mise à jour dynamique.
            },
            (error) => {
                console.error(
                    "Erreur lors de la récupération des échantillons",
                    error
                );
            }
        );
    }

    // Charger tous les utilisateurs
    loadUtilisateurs(): void {
        this.utilisateurService.getAll().subscribe(
            (data: any[]) => {
                this.utilisateurs = data;
                this.totalProducteurs = this.countProducteurs();
                this.TotalProducteur.percentage = "5%";
            },
            (error) => {
                console.error(
                    "Erreur lors du chargement des utilisateurs:",
                    error
                );
            }
        );
    }

    // Compter les utilisateurs ayant le rôle "PRODUCTEUR"
    countProducteurs(): number {
        return this.utilisateurs.filter((user) => user.role === "PRODUCTEUR")
            .length;
    }
}
