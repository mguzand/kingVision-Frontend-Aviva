import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { DebounceDirective } from '../../../../core/directives/debounce.directive';
import { MessageModule } from 'primeng/message';
import { Tooltip } from 'primeng/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Pagination } from '../../../../core/interfaces/pagination.interface';
import { responseAffirmation } from '../../interfaces/affirmation.interface';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { finalize, Subscription } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastService } from '../../../../core/services/toast.service';
import { AffirmationService } from '../../services/affirmation.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NewInteriorHealthComponent } from '../new-interior-health/new-interior-health.component';

@Component({
  selector: 'app-interior-health-table',
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    InputTextModule, 
    PaginatorModule,
    DebounceDirective,
    MessageModule,
    Tooltip,
    RouterLink,
    ConfirmDialogModule 
  ],
  templateUrl: './interior-health-table.component.html',
  styleUrl: './interior-health-table.component.scss'
})
export class InteriorHealthTableComponent {
    public paginationParams: Pagination = {
      currentPage: 1,
      itemsPerPage: 10,
    };

    public data: responseAffirmation = {
          affirmation: [],
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
    ref!: DynamicDialogRef;

    constructor(
      private _router: Router,
      private _toastService: ToastService,
      private _dialogService: DialogService,
      private _activatedRoute: ActivatedRoute,
      private _affirmationService: AffirmationService,
      private _confirmationService: ConfirmationService,
      private _loadingService: LoadingService,
    ) { }

    onDeleteActivity(affirmation: any) {
      this._confirmationService.confirm({
        key: 'confirmDeleteDialog',
        message: '¿Seguro que deseas eliminar este evento de retiro de sanidad interior?',
        header: 'Confirmar acción',
        acceptIcon: 'none',
        rejectIcon: 'none',
        acceptLabel: 'Confirmar',
        rejectLabel: 'Cancelar',
        rejectVisible: true,
        acceptButtonStyleClass:
          'mt-3 m-1   !w-full bg-PRIMARY_COLOR border-[0px] h-[47px] flex items-center justify-center text-[17px] text-white font-bold rounded-full',
        rejectButtonStyleClass:
          'mt-3 m-1   !w-full bg-RED_STRONG border-[0px] h-[47px] flex items-center justify-center text-[17px] text-white font-bold rounded-full',
        accept: () => {
          this._loadingService.onDisplayLoading();
          this._affirmationService.deleteAffirmationsEvent(affirmation.id)
           .pipe(finalize(() => this._loadingService.onHideLoading()))
           .subscribe({
            next: (_) => {
              this._toastService.show({
                severity: 'success',
                summary: 'Evento eliminado',
                detail: `El evento fue eliminado correctamente`,
              });
              this.getAffirmationPaginations();
            },
            error: (error: HttpErrorResponse) => {
              const detail =
                  error.status === 0
                    ? 'No se puede realizar la conexión al servidor'
                    : error.error?.message || error.message;
  
                    this._toastService.show({
                      severity: 'error',
                      summary: 'Error',
                      detail
                    });
  
              },
           })
        },
        reject: () => { },
      });
    }


    openAddHealth() {
              this.ref = this._dialogService.open(NewInteriorHealthComponent, {
                contentStyle: {
                  'max-width': '400px',
                  'min-width': '400px',
                  overflow: 'auto',
                },
                styleClass: 'col458',
                header: 'Agregar nuevo evento',
                baseZIndex: 10,
                closable: true,
              });
          
              this.ref.onClose.subscribe((data: boolean) => {
                if (data) {
                  this.getAffirmationPaginations();
                }
              });
      }




    ngOnInit() {
      this.activatedRouteSubs = this._activatedRoute.queryParams.subscribe(
        (params: Pagination) => {
          this.getAffirmationPaginations();
        }
      );
    }



    getAffirmationPaginations() {
      this.isLoading = true;
      this._affirmationService
        .getAllPaginationsHealth(this.paginationParams, 2)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (dts_person) => {
            this.data = dts_person;
          },
          error: (error: HttpErrorResponse) => {
            const detail =
              error.status === 0
                ? 'No se puede realizar la conexión al servidor'
                : error.error?.message || error.message;
          },
        })
    }


    onPageChange(e: any) {
      this.paginationParams.itemsPerPage = e.rows;
      this.paginationParams.currentPage = e.page + 1;
      this.navigate();
    }
  
    navigate() {
      this.paginationParams = Object.assign(this.paginationParams);
      this._router.navigate([], { queryParams: this.paginationParams });
    }
  
    get pagination() {
      return this.data.pagination;
    }

    onSearch() {
      this.navigate();
    }


        
}
