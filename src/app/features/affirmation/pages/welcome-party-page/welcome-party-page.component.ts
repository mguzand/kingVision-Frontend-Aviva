import { Component } from '@angular/core';
import { SectionHeaderComponent } from '../../../../core/components/section-header/section-header.component';
import { CardModule } from 'primeng/card';
import { WelcomePartyTableComponent } from '../../components/welcome-party-table/welcome-party-table.component';

@Component({
  selector: 'app-welcome-party-page',
  imports: [SectionHeaderComponent, CardModule, WelcomePartyTableComponent],
  templateUrl: './welcome-party-page.component.html',
  styleUrl: './welcome-party-page.component.scss'
})
export class WelcomePartyPageComponent {

}
