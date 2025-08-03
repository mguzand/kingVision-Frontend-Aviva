import { HttpParams } from '@angular/common/http';
import { Pagination } from '../interfaces/pagination.interface';

export const objectToParams = (data: Object): HttpParams => {
  let params = new HttpParams();

  for (const [key, value] of Object.entries(data))
    if (value) params = params.append(key, value);

  return params;
};
