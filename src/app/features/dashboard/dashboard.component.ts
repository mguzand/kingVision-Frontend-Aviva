import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { LoadingService } from '../../core/services/loading.service';
import { finalize, forkJoin } from 'rxjs';
import { PersoService } from '../../core/services/person.service';
import { ChartsComponent } from '../../core/components/charts/charts.component';
 

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [
    CommonModule,
    ChartsComponent,
    CardModule
  ]
})
export class DashboardComponent {

  public stadistic: any;

  trafficItems = [
    { label: 'Ministros', count: 0, icon: 'pi pi-users' },
    { label: 'Ancianos', count: 0, icon: 'pi pi-users' },
    { label: 'Diaconos', count: 0, icon: 'pi pi-users' },
    { label: 'Lideres', count: 0, icon: 'pi pi-users' },
    { label: 'Discipulos', count: 0, icon: 'pi pi-users' },
    { label: 'Miembros', count: 0, icon: 'pi pi-users' },
    { label: 'Nuevo Creyente', count: 0, icon: 'pi pi-users' },
    { label: 'Empresarios', count: 0, icon: 'pi pi-users' },
    { label: 'Redes', count: 6, icon: 'pi pi-users' },
    { label: 'Casas de Avivamiento', count: 26, icon: 'pi pi-users' },
  ];

  targetDetails = [
    { label: 'New Subscriptions', value: 152, goal: 300, color: '#0EA5E9' },
    { label: 'Renewal Contracts', value: 63, goal: 500, color: '#FACC15' },
    { label: 'Upsell Revenue', value: 23, goal: 1000, color: '#A855F7' },
    { label: 'Add-On Sales', value: 42, goal: 2000, color: '#EC4899' },
  ];

  currentTotal = 8571;
  targetTotal = 10000;
  percentageAchieved = 0;
  gradient = 'linear-gradient(to right, #0EA5E9, #FACC15, #A855F7, #EC4899)';

  constructor(
    private _loadingService: LoadingService,
    private _personService: PersoService,
  ){}

  ngOnInit() {
     this.getData();
  }

 
    getData() {
        this._loadingService.onDisplayLoading();
        forkJoin([this._personService.getCountTypePerson()])
          .pipe(
            finalize(() => {
              this._loadingService.onHideLoading();
            })
          )
          .subscribe({
            next: ([countPersonType]) => {
              const labelMap = {
                'Ministros': 'Ministro',
                'Ancianos': 'Anciano',
                'Nuevo Creyente': 'Nuevo Creyente',
                'Miembros': 'Miembro',
                'Discipulos': 'Discipulo',
                'Lideres': 'Lider',
                'Empresarios': 'Empresario',
                'Diaconos': 'Diacono',
                'Redes': 'Red',
              };

              this.trafficItems.forEach(item => {
                const keyInData = labelMap[item.label];
                item.count = countPersonType[keyInData] ?? item.count ;
              });

                  this.stadistic =  {
                        data: {
                          Empresario: countPersonType.Empresario || 0,
                          'Nuevo Creyente': countPersonType['Nuevo Creyente'] || 0,
                          Discipulo: countPersonType.Discipulo || 0,
                          Miembro: countPersonType.Miembro || 0,
                          Lider: countPersonType.Lider || 0,
                          Diacono: countPersonType.Diacono || 0,
                        }
                  };
            },
          });
      }
 
}
