import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { LeadersGroup } from "../../../core/interfaces/groups.interface";



  @Injectable({
    providedIn: 'root'
  })
  export class LeadersService {

    constructor(private _http: HttpClient) { }


    
    addLeadersGroup(data: any, group_id: string ): Observable<any> {
        return this._http.post<any>(`${environment.api}/leaders-group/${ group_id }`, data);
    }

    //Actualizar Estudio por id
  deleteLeadersGroup(people_id: string, group_id: string) {
    return this._http.delete<any>(
      `${environment.api}/leaders-group/${people_id}/${ group_id }`,
      {}
    );
  }

  getOneLeaders(group_id: string) {
      return this._http.get<LeadersGroup>(
        `${environment.api}/leaders-group/${group_id}`
      );
  }






}