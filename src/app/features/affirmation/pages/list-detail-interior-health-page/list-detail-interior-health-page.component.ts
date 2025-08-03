import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ListDetailInteriorHealthTableComponent } from '../../components/list-detail-interior-health-table/list-detail-interior-health-table.component';
import { ActivatedRoute } from '@angular/router';
import { SectionHeaderComponent } from '../../../../core/components/section-header/section-header.component';

@Component({
  selector: 'app-list-detail-interior-health-page',
  imports: [CommonModule, CardModule, ListDetailInteriorHealthTableComponent, SectionHeaderComponent],
  templateUrl: './list-detail-interior-health-page.component.html',
  styleUrl: './list-detail-interior-health-page.component.scss'
})
export class ListDetailInteriorHealthPageComponent {

  public affirmation_id: string = '';
  constructor(private _activatedRoute: ActivatedRoute) {}


  ngOnInit() {
  
      this._activatedRoute.params
            .subscribe(({affirmation_id: affirmation_id = '' }) => {
              this.affirmation_id = affirmation_id;
      });
    }


    

}
