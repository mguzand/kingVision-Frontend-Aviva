import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Pagination } from '../../../core/interfaces/pagination.interface';
import { objectToParams } from '../../../core/helpers/object-to-params.helper';
import { ResponsePeriod } from '../interfaces/response.period.interface';
import { Observable } from 'rxjs';
import { responseListStudent } from '../interfaces/response.list-student.interface';
import { responseNexAffirmation } from '../../affirmation/interfaces/response.affirmation_nex.interface';
import { responseStudent } from '../interfaces/response.student.interface';

@Injectable({
  providedIn: 'root'
})
export class VissionScoolService {

  constructor(private _http: HttpClient) {}


  detailVission(vision_id: string) {
        
        return this._http.get<any>(`${environment.api}/vission-scool/${ vision_id }`,);
  }

  getAll(pagination: Pagination, vision_id: string) {
        const params = objectToParams(pagination);
        return this._http.get<ResponsePeriod>(`${environment.api}/registered-period/${ vision_id }`, {
          params,
        });
  }


  getAllClass(vission_id: string) { 
        return this._http.get<any[]>(`${environment.api}/scool-classes/${ vission_id }`);
  }


  nePeriod(data: any): Observable<any> {
        return this._http.post<any>(`${environment.api}/registered-period`, data);
  }

      getAllPaginations(pagination: Pagination, id_period: string) {
            const params = objectToParams(pagination);
            return this._http.get<responseListStudent>(`${environment.api}/student-list/${id_period}`, {
            params,
            });
      }


      getAllPaginationsNext(affirmation_id, pagination: Pagination) {
            const data = {...pagination}; 
            
            const params = objectToParams(data);
            return this._http.get<responseNexAffirmation>(`${environment.api}/affirmation-health/pagination/${affirmation_id}`, {
            params,
            });
      }

      getAllEvaluationss(period_id: string) { 
            return this._http.get<responseStudent>(`${environment.api}/student-list/evaluation/${period_id}`);
      }

      getAllEvaluationssMarking(period_id: string, scool_class_id: string) { 
            return this._http.get<any>(`${environment.api}/student-attendance/${period_id}/${ scool_class_id }`);
      }


      newStudentPeriod(data: any, period_id: string ): Observable<any> {
       return this._http.post<{period_id: string, people_id: string}[]>(`${environment.api}/student-list/${ period_id }`, data);
      }


      saveStudenAttendance(data: any): Observable<any> {
       return this._http.post<any>(`${environment.api}/student-attendance`, data);
      }



}
