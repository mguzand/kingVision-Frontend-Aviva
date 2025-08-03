import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreatePersonResponse } from '../interfaces/create-person-response.interface';
import { Person } from '../interfaces/manage-person.interface';
import { objectToParams } from '../helpers/object-to-params.helper';
import { Pagination } from '../interfaces/pagination.interface';
import { ResponsePerson, RnpPerson } from '../../features/person/interfaces/person-status.interface';

@Injectable({
  providedIn: 'root',
})
export class PersoService {
  public person$: BehaviorSubject<Person | CreatePersonResponse> =
    new BehaviorSubject<Person | CreatePersonResponse>({
      id: '',
      identity: '',
      names: '',
      surname: '',
      birth_date: '',
      gender: '',
      marital_status: '',
      email: '',
      network_id: '',
      group_id: '',
      address: '',
      phone: ''
    });

  constructor(private _http: HttpClient) { }

  // Verificamos el estado de la persona en las distintas plataformas
  verifyStatus(identidad: string): Observable<ResponsePerson> {
    return this._http.get<ResponsePerson>(
      `${environment.api}/person/status/${identidad}`
    );
  }

  // Verificamos el estado de la persona en las distintas plataformas
  verifyStatusRnp(identidad: string): Observable<RnpPerson> {
    return this._http.get<RnpPerson>(
      `${environment.api}/person/status-rnp/${identidad}`
    );
  }



  //Crear Persona
  createPerson(data: CreatePersonResponse) {
    return this._http.post<CreatePersonResponse>(
      `${environment.api}/person`,
      data
    );
  }

  createPersonProffesion(data: CreatePersonResponse) {
    return this._http.post<CreatePersonResponse>(
      `${environment.api}/person/proffesion`,
      data
    );
  }

  updateBenefit(id: string, data: CreatePersonResponse) {
    return this._http.patch<CreatePersonResponse>(
      `${environment.api}/person/${id}`,
      data
    );
  }

  //Obtener beneficio por id
  getPersonById(id: string) {
    return this._http.get<ResponsePerson>(`${environment.api}/person/status/${id}`);
  }


  putHostGroup(host: boolean, person_id: string){
    return this._http.patch(
      `${environment.api}/person/host/${person_id}`,
      {host}
    );
  }

  searchPeople(query: string): Observable<Person[]> {
      return this._http.get<Person[]>(`${environment.api}/person/search?search=${encodeURIComponent(query)}`);
  }

  getCountTypePerson(): Observable<any> {
      return this._http.get<any>(`${environment.api}/person/total-type-person`);
  }

}
