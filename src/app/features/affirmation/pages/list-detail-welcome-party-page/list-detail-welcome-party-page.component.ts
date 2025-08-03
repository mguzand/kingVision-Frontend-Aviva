import { Component } from '@angular/core';
import { SectionHeaderComponent } from '../../../../core/components/section-header/section-header.component';
import { CardModule } from 'primeng/card';
import { ListDetailWelcomePartyComponent } from '../../components/list-detail-welcome-party/list-detail-welcome-party.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list-detail-welcome-party-page',
  imports: [SectionHeaderComponent, CardModule, ListDetailWelcomePartyComponent],
  templateUrl: './list-detail-welcome-party-page.component.html',
  styleUrl: './list-detail-welcome-party-page.component.scss'
})
export class ListDetailWelcomePartyPageComponent {

  public affirmation_id: string = '';
  constructor(private _activatedRoute: ActivatedRoute) {}


  ngOnInit() {
  
      this._activatedRoute.params
            .subscribe(({affirmation_id: affirmation_id = '' }) => {
              this.affirmation_id = affirmation_id;
      });
    }



}
