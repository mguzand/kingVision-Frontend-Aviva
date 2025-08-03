import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Municipality } from '../interfaces/municipality.interface';
import { environment } from '../../../environments/environment.development';
import { Department } from '../interfaces/department.interface';

@Injectable({
  providedIn: 'root',
})
export class LocalityService {
  constructor(private _http: HttpClient) {}

  // Obtener todos los municipios por el código del departamento
  getMunicipalitysByDeptoId(id: number): Observable<Municipality[]> {
    return this._http.get<Municipality[]>(
      `${environment.apiInstitute}/municipality/${id}`
    );
  }

  // Obtener todos los departamentos
  getDepartments(): Observable<Department[]> {
    return this._http.get<Department[]>(
      `${environment.apiInstitute}/department`
    );
  }
}
