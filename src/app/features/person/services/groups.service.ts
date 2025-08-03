import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Groups } from '../../../core/interfaces/groups.interface';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  constructor(private _http: HttpClient) { }


  getAllGroups(network_id: string) {
    return this._http.get<Groups[]>(
      `${environment.api}/groups/${network_id}`
    );
  }

  getAllPersonGroup(group_id: string) {
        return this._http.get<Groups>(
          `${environment.api}/groups/details/${group_id}`
        );
  }



}
