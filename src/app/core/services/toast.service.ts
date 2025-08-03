import { Injectable } from '@angular/core';
import { ToastMessageOptions, MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private _messageService: MessageService) { }

  show(message: ToastMessageOptions) {
    this._messageService.add({
      key: 'dashboard-toast',
      life: 4000,
      ...message,
    });
  }

  showSuccess() {
    this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
  }

  error(message: ToastMessageOptions) {
    this.show({ severity: 'error', ...message })
  }

  success(message: ToastMessageOptions) {
    this.show({ severity: 'success', ...message })
  }


}
