import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { Pagination } from '../../../../core/interfaces/pagination.interface';
import { responseEventsInterface } from '../../interfaces/response.events.interface';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../../core/services/toast.service';
import { DialogService } from 'primeng/dynamicdialog';
import { EventsService } from '../../services/events.service';
import { finalize, Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-manage-event-page',
  imports: [
    CardModule,
    TableModule,
    ButtonModule,
    CommonModule,
    RouterLink,
    Tooltip
  ],
  templateUrl: './manage-event-page.component.html',
  styleUrl: './manage-event-page.component.scss'
})
export class ManageEventPageComponent {

  public paginationParams: Pagination = {
      currentPage: 1,
      itemsPerPage: 10,
    };
  
    public data: responseEventsInterface = {
      events: [],
      pagination: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 0,
      },
    };

    public menuItems: { [key: string]: MenuItem[] } = {};
    public activatedRouteSubs!: Subscription;
    public isLoading: boolean = false;
    
    constructor(
      private _router: Router,
      private _toastService: ToastService,
      private _dialogService: DialogService,
      private _activatedRoute: ActivatedRoute,
      private _eventsService: EventsService
    ) { }


    ngOnInit() {
      this.activatedRouteSubs = this._activatedRoute.queryParams.subscribe(
        (params: Pagination) => {
          this.getAllEvents();
        }
      );
    }

    getAllEvents() {
      this.isLoading = true;
      this._eventsService
        .getAllPaginations(this.paginationParams)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (_dts) => {
            this.data = _dts;
          },
          error: (error: HttpErrorResponse) => {
            const detail =
              error.status === 0
                ? 'No se puede realizar la conexión al servidor'
                : error.error?.message || error.message;
          },
        })
    }



}
