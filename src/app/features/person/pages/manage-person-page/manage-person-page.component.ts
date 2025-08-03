import { Component } from '@angular/core';
import { SectionHeaderComponent } from '../../../../core/components/section-header/section-header.component';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { MemberManageTableComponent } from '../../components/member-manage-table/member-manage-table.component';

@Component({
  selector: 'app-manage-person-page',
  imports: [SectionHeaderComponent, CommonModule, CardModule, MemberManageTableComponent],
  templateUrl: './manage-person-page.component.html',
  styleUrl: './manage-person-page.component.scss'
})
export class ManagePersonPageComponent {

}
