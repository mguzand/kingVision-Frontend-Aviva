import { Component, Input } from '@angular/core';
import { StadisticService } from '../../services/stadistic.service';
import {ChartModule, UIChart} from 'primeng/chart';

@Component({
  selector: 'app-charts',
  imports: [
    ChartModule
  ],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.scss'
})
export class ChartsComponent {
  pieData: any; 
  @Input() stadistic: any;
  @Input() type: UIChart['type'] = 'pie';
  @Input() name!: string;
  // Data para los graficos
  public data: any = {};

  constructor(private _stadisticService: StadisticService) { }


   ngOnInit(): void { 
    this.data.labels = Object.keys(this.stadistic.data);
    this.data.datasets = [{
      data: Object.keys(this.stadistic.data).map(
        (d) => this.stadistic.data[d]
      ),
      backgroundColor: this.generateRandomColors(this.data.labels.length),
      label: this.stadistic.title,
    }]
  }


   generateRandomColors(amount: number) {
    let colors = [];
    let index = 0; 
    const months = ["ffc102", "55b13e", "576ecf", "5b9cd6", "f58372", "f0472e", "a0d792", "a7a6a7"];
    for (let a of new Array(amount)) {
      colors.push(
        `#${ months[index]  }`
        //`#${((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0')}`
      );
      index++;
    }
    return colors;
  }

  // Getters
  get chartJsConfig() {
    return this._stadisticService.chartJsConfig;
  }

  

}
