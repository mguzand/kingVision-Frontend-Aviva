import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Pagination } from "../../../core/interfaces/pagination.interface";
import { objectToParams } from "../../../core/helpers/object-to-params.helper";
import { environment } from "../../../../environments/environment";
import { ResponsePeron } from "../interfaces/person.interface";
import { Observable } from "rxjs";
import { Person } from "../../../core/interfaces/manage-person.interface";



@Injectable({
    providedIn: 'root',
  })
  export class PersonService {
    
    constructor(private _http: HttpClient) {}
    
    getAllAssistance(pagination: Pagination, event_id: string) {
      const params = objectToParams(pagination);
      return this._http.get<ResponsePeron>(`${environment.api}/person/${ event_id }`, {
        params,
      });
    }


    getAll(pagination: Pagination) {
      const params = objectToParams(pagination);
      return this._http.get<ResponsePeron>(`${environment.api}/person`, {
        params,
      });
    }

    getPersonLeaders(network_id: string){
      return this._http.get<Person[]>(`${environment.api}/person/leaders/${ network_id }`);
    }


    searchPeople(query: string): Observable<Person[]> {
      return this._http.get<Person[]>(`${environment.api}/person/search?search=${encodeURIComponent(query)}`);
    }

     

    updateGroups(data: any) {
      return this._http.patch<any>(
        `${environment.api}/person/update/groups`,
        data
      );
    }

    

}