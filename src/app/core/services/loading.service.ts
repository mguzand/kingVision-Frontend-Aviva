import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  constructor(private _ngxSpinner: NgxSpinnerService) {}

  onDisplayLoading() {
    this._ngxSpinner.show('dashboard-loading');
  }

  onHideLoading() {
    this._ngxSpinner.hide('dashboard-loading');
  }
}
