import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { conversionResponse } from '../interfaces/conversion.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConversionService {
  public conversion$: BehaviorSubject<conversionResponse> =
    new BehaviorSubject<conversionResponse>({
      id: '',
      date_conversion: '',
      conversion_type: 1,
      network_type: '',
    });




  constructor(private _http: HttpClient) { }

  //Obtener datos conversion por id persona
  getConversionById(id: string) {
    return this._http.get<conversionResponse[]>(
      `${environment.api}/conversion/${id}`
    );
  }

  createConversion(data: conversionResponse) {
    return this._http.post<conversionResponse>(
      `${environment.api}/conversion`,
      data
    );
  }

  //Eliminar el Estudio por id
  delete(id: number) {
    return this._http.delete<conversionResponse>(
      `${environment.api}/conversion/${id}`
    );
  }
}
