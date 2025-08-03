import { Component } from '@angular/core';
import { SectionHeaderComponent } from '../../../../core/components/section-header/section-header.component';
import { CardModule } from 'primeng/card';
import { ProfessionManageTableComponent } from '../../components/profession-manage-table/profession-manage-table.component';

@Component({
  selector: 'app-proffesion-manage-page',
  imports: [SectionHeaderComponent, CardModule, ProfessionManageTableComponent],
  templateUrl: './proffesion-manage-page.component.html',
  styleUrl: './proffesion-manage-page.component.scss'
})
export class ProffesionManagePageComponent {

}
