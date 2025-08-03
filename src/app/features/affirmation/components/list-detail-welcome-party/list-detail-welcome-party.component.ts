import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { ToastService } from '../../../../core/services/toast.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AffirmationService } from '../../services/affirmation.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { responseAffirmationList } from '../../interfaces/affirmationList.interface';
import { AgePipe } from '../../../../core/pipes/age.pipe';
import { Tooltip } from 'primeng/tooltip';
import { WelcomePartyPdfComponent } from '../welcome-party-pdf/welcome-party-pdf.component';
import { WelcomePartyAddComponent } from '../welcome-party-add/welcome-party-add.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { LoadingService } from '../../../../core/services/loading.service';

@Component({
  selector: 'app-list-detail-welcome-party',
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    MessageModule,
    AgePipe,
    Tooltip,
    ConfirmDialogModule
  ],
  templateUrl: './list-detail-welcome-party.component.html',
  styleUrl: './list-detail-welcome-party.component.scss'
})
export class ListDetailWelcomePartyComponent {
  public isLoading: boolean = false;
  public data: responseAffirmationList[] = [];
  @Input({ required: true }) affirmation_id!: string;
  ref!: DynamicDialogRef;
  refd!: DynamicDialogRef;
  
  constructor(
    private _toastService: ToastService,
    private _dialogService: DialogService,
    private _affirmationService: AffirmationService,
    private _confirmationService: ConfirmationService,
    private _loadingService: LoadingService,
    
  ) { }

  ngOnInit() {
    this.getAffirmationList();
  }

  howOpenPdf(){
    this.refd = this._dialogService.open(WelcomePartyPdfComponent, {
      width: '60vw',
      height: '100%',
      styleClass: 'col458',
      header: 'Reporte de Fiesta de Bienvenida',
      baseZIndex: 10,
      closable: true, 
      // Desactiva el auto enfoque
      data: {affirmation_id: this.affirmation_id },
      focusOnShow: false,
      
    });
  }


  onActivateActivity(affirmation: any){
    this._confirmationService.confirm({
      key: 'confirmDeleteDialog',
      message: `Se modificará la asistencia o inasistencia del participante <br>${ affirmation.person.names } ${ affirmation.person.surname }`,
      header: 'Modificar Asistencia',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: affirmation.attended ? 'Confirmar inasistencia' : 'Confirmar Asistencia',
      rejectLabel: 'Cancelar',
      rejectVisible: false,
      acceptButtonStyleClass:
        'mt-3 m-1   !w-full bg-PRIMARY_COLOR border-[0px] h-[47px] flex items-center justify-center text-[17px] text-white font-bold rounded-full',
      rejectButtonStyleClass:
        'mt-3 m-1   !w-full bg-RED_STRONG border-[0px] h-[47px] flex items-center justify-center text-[17px] text-white font-bold rounded-full',
      accept: () => {
        this._loadingService.onDisplayLoading();
        this._affirmationService.updateAssistance(affirmation.people_id, affirmation.affirmation_id)
         .pipe(finalize(() => this._loadingService.onHideLoading()))
         .subscribe({
          next: (_) => {
            this._toastService.show({
              severity: 'success',
              summary: affirmation.attended ? 'Asistencia removida': 'Asistencia Confirmada',
              detail: `Datos actualizados correctamente`,
            });


            const group = this.data.find(g => g.people_id === affirmation.people_id)
            group.attended = !group.attended;
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


  onDeleteActivity(affirmation: any) {
    this._confirmationService.confirm({
      key: 'confirmDeleteDialog',
      message: '¿Seguro que deseas eliminar este participante de la fiesta de bienvenida?',
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
        this._affirmationService.deleteAffirmations(affirmation.people_id, affirmation.affirmation_id)
         .pipe(finalize(() => this._loadingService.onHideLoading()))
         .subscribe({
          next: (_) => {
            this._toastService.show({
              severity: 'success',
              summary: 'Participante removido ',
              detail: `El participante fue removido de la lista`,
            });
             
              
                this.getAffirmationList();
            
          }
         })
      },
      reject: () => { },
    });
  }



  openAddParty() {
      this.ref = this._dialogService.open(WelcomePartyAddComponent, {
        contentStyle: {
          'max-width': '400px',
          'min-width': '400px',
          overflow: 'auto',
        },
        styleClass: 'col458',
        header: 'Agregar participante',
        baseZIndex: 10,
        closable: true, 
        data: {
          affirmation_id: this.affirmation_id
        }
      });
  
      this.ref.onClose.subscribe((data: boolean) => {
        if (data) {
          this.getAffirmationList();
        }
      });
    }

  getAffirmationList() {
    this.isLoading = true;
    this._affirmationService
       .getAllAfirmationList(this.affirmation_id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data_list) => {
          this.data = data_list;
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
