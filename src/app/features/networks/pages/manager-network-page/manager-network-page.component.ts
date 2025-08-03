import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SectionHeaderComponent } from '../../../../core/components/section-header/section-header.component';
import { CardModule } from 'primeng/card';
import { NetworksManageTableComponent } from '../../components/networks-manage-table/networks-manage-table.component';

@Component({
  selector: 'app-manager-network-page',
  imports: [CommonModule, SectionHeaderComponent, CardModule, NetworksManageTableComponent],
  templateUrl: './manager-network-page.component.html',
  styleUrl: './manager-network-page.component.scss'
})
export class ManagerNetworkPageComponent {

}
