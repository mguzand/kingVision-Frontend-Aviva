import { Component } from '@angular/core';
import { SectionHeaderComponent } from '../../../../core/components/section-header/section-header.component';
import { ListStudentTableComponent } from '../../componets/list-student-table/list-student-table.component';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-list-student-page',
  imports: [
    SectionHeaderComponent,
    ListStudentTableComponent,
    CardModule
  ],
  templateUrl: './list-student-page.component.html',
  styleUrl: './list-student-page.component.scss'
})
export class ListStudentPageComponent {

}
