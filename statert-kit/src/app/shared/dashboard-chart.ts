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

export const TotalUtilisateur: ChartOptions | any = {
    series: [{
        name: "Desktops",
        data: [10, 35, 15, 78, 40, 60, 12, 60],
    }],
    chart: {
        type: 'area',
        height: 120,
        offsetY: 50,
        zoom: {
            enabled: false
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
            color: '#61AE41',
            opacity: 0.2,
        },
    },
    colors: ['#61AE41'],
    fill: {
        type: "gradient",
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.6,
            opacityTo: 0.2,
            stops: [0, 100, 100]
        }
    },
    dataLabels: {
        enabled: false
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
        curve: 'straight',
        width: 2,
    },
    tooltip: {
        custom: function ({ series, seriesIndex, dataPointIndex, }: any) {
            return '<div class="apex-tooltip p-2">' + '<span>' + '<span class="bg-primary">' + '</span>' + 'customer' + '<h3>' + '$' + series[seriesIndex][dataPointIndex] + '<h3/>' + '</span>' + '</div>';
        },
    },

    title: 'Total Utilisateur',
    class: 'total-customer',
    chartclass: 'customer-chart',
    price: '62,828',
    arrowicon: 'arrow-chart',
    icon: 'Customer',
    percentage: '-24%',
    color: 'danger'
}

export const TotalProducteur: ChartOptions | any = {
    series: [{
        name: "Desktops",
        data: [10, 35, 15, 78, 40, 60, 12, 60],
    }],
    chart: {
        type: 'area',
        height: 120,
        offsetY: 50,
        zoom: {
            enabled: false
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
            color: '#61AE41',
            opacity: 0.2,
        },
    },
    colors: ['#61AE41'],
    fill: {
        type: "gradient",
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.6,
            opacityTo: 0.2,
            stops: [0, 100, 100]
        }
    },
    dataLabels: {
        enabled: false
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
        curve: 'straight',
        width: 2,
    },
    tooltip: {
        custom: function ({ series, seriesIndex, dataPointIndex, }: any) {
            return '<div class="apex-tooltip p-2">' + '<span>' + '<span class="bg-primary">' + '</span>' + 'customer' + '<h3>' + '$' + series[seriesIndex][dataPointIndex] + '<h3/>' + '</span>' + '</div>';
        },
    },

    title: 'Total Producteur',
    class: 'total-customer',
    chartclass: 'customer-chart',
    price: '62,828',
    arrowicon: 'arrow-chart',
    icon: 'Customer',
    percentage: '-24%',
    color: 'danger'
}

export const TotalEchantillon: ChartOptions | any = {
  series: [{
    name: "Desktops",
    data: [50, 50, 50, 25, 25, 25, 2, 2, 2, 25, 25, 25, 62, 62, 62, 35, 35, 35, 66, 66],
}],
chart: {
    height: 100,
    type: 'area',
    zoom: {
        enabled: false
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
        color: '#44A8D7',
        opacity: 0.2,
    },
},
fill: {
    type: "gradient",
    gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.1,
        stops: [0, 90, 100]
    }
},
tooltip: {
    enabled: false
},
dataLabels: {
    enabled: false
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
    curve: 'straight',
    width: 2,
},
markers: {
    discrete: [{
        seriesIndex: 0,
        dataPointIndex: 12,
        fillColor: '#44A8D7',
        strokeColor: '#44A8D7',
        size: 5,
        shape: "circle"
    }],
},

    title: 'Total Echantillon',
    class: 'total-product',
    chartclass: 'total-product-chart',
    price: '72,982',
    arrowicon: 'arrow-chart-up',
    icon: 'Product',
    percentage: '+42%',
    color: 'success'
}

export const TotalSensoriel: ChartOptions | any = {
    series: [{
      name: "Desktops",
      data: [50, 50, 50, 25, 25, 25, 2, 2, 2, 25, 25, 25, 62, 62, 62, 35, 35, 35, 66, 66],
  }],
  chart: {
      height: 100,
      type: 'area',
      zoom: {
          enabled: false
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
          color: '#44A8D7',
          opacity: 0.2,
      },
  },
  fill: {
      type: "gradient",
      gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.5,
          opacityTo: 0.1,
          stops: [0, 90, 100]
      }
  },
  tooltip: {
      enabled: false
  },
  dataLabels: {
      enabled: false
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
      curve: 'straight',
      width: 2,
  },
  markers: {
      discrete: [{
          seriesIndex: 0,
          dataPointIndex: 12,
          fillColor: '#44A8D7',
          strokeColor: '#44A8D7',
          size: 5,
          shape: "circle"
      }],
  },
  
      title: 'Total Sensoriel',
      class: 'total-product',
      chartclass: 'total-product-chart',
      price: '72,982',
      arrowicon: 'arrow-chart-up',
      icon: 'Product',
      percentage: '+42%',
      color: 'success'
  }


