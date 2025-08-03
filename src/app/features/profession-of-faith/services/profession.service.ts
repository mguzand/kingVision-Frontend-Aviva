import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from '../../../core/interfaces/pagination.interface';
import { objectToParams } from '../../../core/helpers/object-to-params.helper';
import { ProffesionResponse } from '../interfaces/profession.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfessionService {

  constructor(private _http: HttpClient) { }


  getAllPaginations(pagination: Pagination) {
        const params = objectToParams(pagination);
        return this._http.get<ProffesionResponse>(`${environment.api}/conversion/pagination`, {
          params,
        });
  }

  getPdfAProfession(search: string) {
    return this._http.get(`${environment.api}/conversion/generate-pdf?search=${search}`, {
      responseType: 'blob',
    });
  }

  getProffesionPdfExt(search: string) {
    return this._http.get(`${environment.api}/conversion/generate-pdf-ext?search=${search}`, {
      responseType: 'blob',
    });
  }



}
