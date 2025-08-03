import { Component } from '@angular/core';
import { SectionHeaderComponent } from '../../../../core/components/section-header/section-header.component';
import { CardModule } from 'primeng/card';
import { InteriorHealthTableComponent } from '../../components/interior-health-table/interior-health-table.component';

@Component({
  selector: 'app-interior-health-page',
  imports: [SectionHeaderComponent, CardModule, InteriorHealthTableComponent],
  templateUrl: './interior-health-page.component.html',
  styleUrl: './interior-health-page.component.scss'
})
export class InteriorHealthPageComponent {

}
