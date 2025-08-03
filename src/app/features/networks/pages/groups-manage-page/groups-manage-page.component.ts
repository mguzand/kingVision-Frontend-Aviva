import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SectionHeaderComponent } from '../../../../core/components/section-header/section-header.component';
import { CardModule } from 'primeng/card';
import { ActivatedRoute } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { GroupsManageTableComponent } from '../../components/groups-manage-table/groups-manage-table.component';

@Component({
  selector: 'app-groups-manage-page',
  imports: [CommonModule, SectionHeaderComponent, CardModule, GroupsManageTableComponent],
  templateUrl: './groups-manage-page.component.html',
  styleUrl: './groups-manage-page.component.scss'
})
export class GroupsManagePageComponent {
  private secretKey = 'm4nu3lGuzm4n1993';
  public redName: string = '';
  public network_id: string = '';

  constructor(private _activatedRoute: ActivatedRoute,) {}
  
  ngOnInit() {

    this._activatedRoute.params
          .subscribe(({ name: name = '', network_id: network_id = '' }) => {
            this.network_id = network_id;
            const bytes = CryptoJS.AES.decrypt(this.decryptUrlSafe(name) , this.secretKey);
            this.redName = bytes.toString(CryptoJS.enc.Utf8);  
    });
  }


  private decryptUrlSafe(urlSafe: string): string {
    let base64 = urlSafe
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const padding = 4 - (base64.length % 4);
    if (padding !== 4) {
      base64 += '='.repeat(padding);
    }
    return base64;
  }

}
