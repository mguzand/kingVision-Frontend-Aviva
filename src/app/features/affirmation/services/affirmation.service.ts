import { Injectable } from '@angular/core';
import { Pagination } from '../../../core/interfaces/pagination.interface';
import { objectToParams } from '../../../core/helpers/object-to-params.helper';
import { responseAffirmation } from '../interfaces/affirmation.interface';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { responseAffirmationList } from '../interfaces/affirmationList.interface';
import { Observable } from 'rxjs';
import { responseNexAffirmation } from '../interfaces/response.affirmation_nex.interface';

@Injectable({
  providedIn: 'root'
})
export class AffirmationService {

  constructor(private _http: HttpClient) { }

  deleteAffirmationsEvent(affirmation_id: string) {
    return this._http.delete<any>(
      `${environment.api}/affirmation/${affirmation_id}`,
      {}
    );
  }

  deleteAffirmations(people_id: string, affirmation_id: string) {
    return this._http.delete<any>(
      `${environment.api}/affirmation-list/${people_id}/${affirmation_id}`,
      {}
    );
  }

  deleteAffirmationsHealdth(people_id: string, affirmation_id: string) {
    return this._http.delete<any>(
      `${environment.api}/affirmation-health/${people_id}/${affirmation_id}`,
      {}
    );
  }

  updateAssistance(people_id: string, affirmation_id: string) {
    return this._http.patch<any>(
      `${environment.api}/affirmation-list/${people_id}/${affirmation_id}`,
      {}
    );
  }

  updateAssistanceHealth(people_id: string, affirmation_id: string, typeMetodo: string) {
    return this._http.patch<any>(
      `${environment.api}/affirmation-health/${people_id}/${affirmation_id}/${typeMetodo}`,
      {}
    );
  }

  newAffirmation(data: any): Observable<any> {
      return this._http.post<any>(`${environment.api}/affirmation`, data);
  }

  newAffirmationListHealth(data: any, affirmation_id: string ): Observable<any> {
    return this._http.post<any>(`${environment.api}/affirmation-health/${ affirmation_id }`, data);
}

  getAllPaginationsHealth(pagination: Pagination, type: number) {
    const params = objectToParams(pagination);
    return this._http.get<responseAffirmation>(`${environment.api}/affirmation/pagination-health`, {
      params,
    });
}

  getAllPaginations(pagination: Pagination, type: number) {
      const params = objectToParams(pagination);
      return this._http.get<responseAffirmation>(`${environment.api}/affirmation/pagination/${type}`, {
        params,
      });
  }


  getAllAfirmationListHealth(affirmation_id: string) {
    return this._http.get<responseAffirmationList[]>(`${environment.api}/affirmation-health/${ affirmation_id }`);
  }

  getAllAfirmationList(affirmation_id: string) {
    return this._http.get<responseAffirmationList[]>(`${environment.api}/affirmation-list/${ affirmation_id }`);
  }

  getPdfAffirmationHealth(id_affirmation: string) {
    return this._http.get(`${environment.api}/affirmation/report-health/${id_affirmation}`, {
      responseType: 'blob',
    });
  }

  getPdfAffirmationHealthInternal(id_affirmation: string) {
    return this._http.get(`${environment.api}/affirmation/report-health-internal/${id_affirmation}`, {
      responseType: 'blob',
    });
  }

  addParticipantsHealth(data: { people_id: string; affirmation_id: string }): Observable<any> {
      return this._http.post<any>(`${environment.api}/affirmation-health`, data);
  }


  getPdfAffirmation(affirmation_id: string) {
    return this._http.get(`${environment.api}/affirmation/report/${ affirmation_id }`, {
      responseType: 'blob',
    });
  }


 
  addParticipants(data: { people_id: string; affirmation_id: string }): Observable<any> {
      return this._http.post<any>(`${environment.api}/affirmation-list`, data);
  }


  getAllPaginationsNext(affirmation_id, pagination: Pagination, health: boolean) {
    const data = {...pagination, health};
    console.log(data);
    
    const params = objectToParams(data);
    return this._http.get<responseNexAffirmation>(`${environment.api}/affirmation-list/pagination/${affirmation_id}`, {
      params,
    });
}

getReportAttendedStudent(period_id: string) {
    return this._http.get(`${environment.api}/student-attendance/${period_id}`, {
      responseType: 'blob',
    });
  }

  getReportAttendedStudentGeneral(period_id: string) {
    return this._http.get(`${environment.api}/student-attendance/internal/${period_id}`, {
      responseType: 'blob',
    });
  }






    
}
