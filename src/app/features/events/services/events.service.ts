import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Pagination } from "../../../core/interfaces/pagination.interface";
import { objectToParams } from "../../../core/helpers/object-to-params.helper";
import { responseEventsInterface } from "../interfaces/response.events.interface";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EventsService {

    constructor(private _http: HttpClient) { }

    getAllPaginations(pagination: Pagination) {
        const params = objectToParams(pagination);
        return this._http.get<responseEventsInterface>(`${environment.api}/events`, {
          params,
        });
    }


    updateStatus(personId: string, status: boolean, event_id: string): Observable<any> {
      return this._http.patch(`${environment.api}/events-assistance/${personId}/status`, { status, event_id });
    }

}