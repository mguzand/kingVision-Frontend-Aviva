import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { AgePipe } from '../../../../core/pipes/age.pipe';
import { FormsModule } from '@angular/forms'; 
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LoadingService } from '../../../../core/services/loading.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Person } from '../../../../core/interfaces/manage-person.interface';
import { PersonService } from '../../../person/services/person.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { LeadersService } from '../../services/leaders.service';

@Component({
  selector: 'app-leaders-of-group',
  imports: [
    TableModule,
    IconFieldModule,
    CommonModule,
    InputIconModule,
    InputTextModule,
    AgePipe,
    FormsModule
  ],
  templateUrl: './leaders-of-group.component.html',
  styleUrl: './leaders-of-group.component.scss'
})
export class LeadersOfGroupComponent {
  selectedAffirmation: Person[] = [];
  isLoading: boolean = false;
  data: Person[] = [];

  constructor(
    private cd: ChangeDetectorRef,
    private _person: PersonService,
    private config: DynamicDialogConfig,
    private _loadingService: LoadingService,
    private _LeadersService: LeadersService,
    public ref: DynamicDialogRef,
    private _toastService: ToastService
  ){}


  ngOnInit() {
      this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this._person
      .getPersonLeaders(this.config.data.network_id)
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


  closeModal(): void {
    this.ref.close();
  }

  andList(){
    const selectedIds = this.selectedAffirmation.map(row => row.id);
    this._loadingService.onDisplayLoading();
    this._LeadersService.addLeadersGroup(selectedIds, this.config.data.id)
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
          summary: `Lider agregado correctamente`,
          detail: `Se agregaron correctamente los lideres seleccionados`,
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
