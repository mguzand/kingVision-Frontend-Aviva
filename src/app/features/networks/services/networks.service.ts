import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Networks } from '../../person/interfaces/network.interface';
import { Pagination } from '../../../core/interfaces/pagination.interface';
import { objectToParams } from '../../../core/helpers/object-to-params.helper';
import { responseNetwork } from '../interfaces/response.network.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { responseGroup } from '../interfaces/response.groups.interface';

@Injectable({
  providedIn: 'root'
})
export class NetworksService {

  public networks$: BehaviorSubject<{ name: string }> = new BehaviorSubject<{ name: string }>({
    name: ''
  });


  constructor(private _http: HttpClient) { }


  getAllNetworks() {
    return this._http.get<Networks[]>(
      `${environment.api}/networks`
    );
  }

  //Actualizar Estudio por id
  updateGroup(id: string) {
    return this._http.patch<any>(
      `${environment.api}/groups/${id}`,
      {}
    );
  }

  getAllPaginations(pagination: Pagination) {
    const params = objectToParams(pagination);
    return this._http.get<responseNetwork>(`${environment.api}/networks/pagination`, {
      params,
    });
  }

  getAllPaginationsGroups(network_id: string, pagination: Pagination) {
    const params = objectToParams(pagination);
    return this._http.get<responseGroup>(`${environment.api}/groups/pagination/${network_id}`, {
      params,
    });
  }



  // Register new revival network
  onCreateNetWorks(data: { id: number; nombre_red: string }): Observable<any> {
    return this._http.post<any>(`${environment.api}/networks`, data);
  }

  //Register new group
  onCreateGroups(data: { id: number; nombre_red: string }): Observable<any> {
    return this._http.post<any>(`${environment.api}/groups`, data);
  }

  onEdit(data: Networks) {
    return this._http.put<any>(`${environment.api}/networks`, data);
  }

  onEditGroups(data: Networks) {
    return this._http.put<any>(`${environment.api}/groups`, data);
  }





}
