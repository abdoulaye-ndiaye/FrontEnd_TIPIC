import { Component, Input, OnInit } from "@angular/core";
import { AuthService } from "../../../services/auth.service";
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
}

let primary_color = localStorage.getItem('primary_color') || '#5C61F2';
let secondary_color = localStorage.getItem('secondary_color') || '#FF9766';

@Component({
    selector: "app-dashboard-admin",
    standalone: true,
    imports: [CommonModule, RouterModule, NgApexchartsModule],
    templateUrl: "./dashboard-admin.component.html",
    styleUrl: "./dashboard-admin.component.scss",
})
export class DashboardAdminComponent implements OnInit {
    @Input() data: ChartOptions | any = {
        series: [{
            name: 'Revenue',
            data: [92, 64, 43, 80, 58, 92, 46, 76, 80]
        }, {
            name: 'Revenue',
            data: [20, 48, 69, 32, 54, 20, 66, 36, 32],
        },
        ],
        chart: {
            type: 'bar',
            offsetY: 30,
            toolbar: {
                show: false
            },
            height: 100,
            stacked: true,
        },
        states: {
            hover: {
                filter: {
                    type: 'darken',
                    value: 1,
                }
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                s̶t̶a̶r̶t̶i̶n̶g̶S̶h̶a̶p̶e̶: 'flat',
                e̶n̶d̶i̶n̶g̶S̶h̶a̶p̶e̶: 'flat',
                borderRadius: 3,
                columnWidth: '55%',
            }
        },
        dataLabels: {
            enabled: false
        },
        grid: {
            yaxis: {
                lines: {
                    show: false
                }
            },
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
            dataLabels: {
                enabled: true
            },
        },
        fill: {
            opacity: 1,
            colors: ['#dedffc',primary_color, ]
        },
        legend: {
            show: false
        },
        tooltip: {
            custom: function ({ series, seriesIndex, dataPointIndex, }: any) {
                return '<div class="apex-tooltip p-2">' + '<span>' + '<span class="bg-primary">' + '</span>' + 'Revenue' + '<h3>' + '$' + series[seriesIndex][dataPointIndex] + '<h3/>' + '</span>' + '</div>';
            },
        },
        title: 'Total Revenue',
        price: '$73,927',
        arrowicon: 'arrow-chart-up',
        chartclass: 'earning-chart',
        icon: 'Revenue',
        percentage: '+34%',
        color: 'success'
    };
      
    constructor(private authService: AuthService) {}
    nom: string;
    prenom: string;
    decodedToken: any;

    ngOnInit(): void {
        const token = localStorage.getItem("token") as string;
        this.decodedToken = jwtDecode(token);
        //console.log(this.decodedToken);
        this.nom = this.decodedToken.user.nom;
        this.prenom = this.decodedToken.user.prenom;
    }
}
