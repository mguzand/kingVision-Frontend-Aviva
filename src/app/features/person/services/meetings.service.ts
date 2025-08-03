import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MeetingsService {
  constructor(private _http: HttpClient) { }

  getMeetings() {
    return this._http.get<any[]>(`${environment.api}/type-of-meetings`);
  }
}
