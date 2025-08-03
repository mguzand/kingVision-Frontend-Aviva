import { Injectable } from '@angular/core';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Injectable({
  providedIn: 'root',
})
export class StadisticService {
  // Configuracion de ChartJs
  private _chartJsConfig = {
    plugins: [ChartDataLabels],
    options: {
      plugins: {
        datalabels: {
          formatter: (value: any, ctx: any) => {
            let sum = 0;
            let dataArr = ctx.chart.data.datasets[0].data;
            dataArr.map((data: any) => {
              sum += data;
            });
            let percentage = ((value * 100) / sum).toFixed(2) + '%';
            return percentage;
          },
          color: '#000',
          backgroundColor: '#fff',
          textShadowColor: 'black',
          padding: 10,
          borderRadius: 5,
          font: {
            weight: 'bold',
            size: '16px',
          },
        },
        tooltip: {
          enabled: true,
        },
      },
      scale: {
        ticks: {
          precision: 0,
        },
      },
    },
  };

  get chartJsConfig() {
    return this._chartJsConfig;
  }
}