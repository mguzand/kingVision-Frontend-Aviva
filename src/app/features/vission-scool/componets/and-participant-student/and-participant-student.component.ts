import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { Pagination } from '../../../../core/interfaces/pagination.interface';
import { AfirmationList, responseNexAffirmation } from '../../../affirmation/interfaces/response.affirmation_nex.interface';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LoadingService } from '../../../../core/services/loading.service';
import { ToastService } from '../../../../core/services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { VissionScoolService } from '../../service/vission-scool.service';
import { IconFieldModule } from 'primeng/iconfield';
import { CommonModule } from '@angular/common';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { AgePipe } from '../../../../core/pipes/age.pipe';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToggleButton } from 'primeng/togglebutton';

@Component({
  selector: 'app-and-participant-student',
  imports: [
    TableModule,
    IconFieldModule,
    CommonModule,
    InputIconModule,
    InputTextModule,
    AgePipe,
    PaginatorModule,
    FormsModule,
    DropdownModule,
    ToggleSwitchModule
  ],
  templateUrl: './and-participant-student.component.html',
  styleUrl: './and-participant-student.component.scss'
})
export class AndParticipantStudentComponent {
    @ViewChild('dt') dt!: Table;

    public paginationParams: Pagination = {
            currentPage: 1,
            itemsPerPage: 10,
      };
    
      public valuePaginators = [
        { value: 10 },
        { value: 20},
        { value: 30},
        { value: 50}
      ];
    
      public data: responseNexAffirmation = {
        affirmation: [],
        pagination: {
          currentPage: 1,
          itemsPerPage: 10,
          totalItems: 0,
          totalPages: 0,
        },
      };

      selectedAffirmation: AfirmationList[] = [];
      isLoading: boolean = false;


      constructor(
        private cd: ChangeDetectorRef,
        private _vissionScoolService: VissionScoolService,
        private config: DynamicDialogConfig,
        private _loadingService: LoadingService,
        private _toastService: ToastService,
        public ref: DynamicDialogRef,
      ){}

      ngOnInit() {
          this.loadData();
      }

      onSearch() {
        this.loadData();
      }


      loadData() {
        this.isLoading = true;
        this._vissionScoolService
          .getAllPaginationsNext(this.config.data.period_id, this.paginationParams)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe({
            next: (data_response) => {
              this.data = data_response; 
              this.cd.markForCheck();
            },
            error: (error: HttpErrorResponse) => {
              const detail =
                error.status === 0
                  ? 'No se puede realizar la conexión al servidor'
                  : error.error?.message || error.message;
            },
          })
      }

      get pagination() {
        return this.data.pagination;
      }

      onPageChange(e: any) {
        this.paginationParams.itemsPerPage = e.rows;
        this.paginationParams.currentPage = e.page + 1;
        this.loadData();
    }
 




    andList(){
    const selectedIds = this.selectedAffirmation.map(row => row.person.id);
    this._loadingService.onDisplayLoading();
    this._vissionScoolService.newStudentPeriod(selectedIds, this.config.data.period_id)
    .pipe(
        finalize(() => {
          this._loadingService.onHideLoading();
          this.isLoading = true;
        })
    )
    .subscribe({
      next: (_) => {
        this._toastService.show({
          severity: 'success',
          summary: `Participantes agregados correctamente`,
          detail: `Se agregaron correctamente el las personas seleccionadas`,
        });
        this.ref.close(true);
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
  }


      
}
