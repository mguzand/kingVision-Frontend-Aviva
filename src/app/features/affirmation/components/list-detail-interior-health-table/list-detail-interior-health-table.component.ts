import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { responseAffirmationList } from '../../interfaces/affirmationList.interface';
import { ToastService } from '../../../../core/services/toast.service';
import { AffirmationService } from '../../services/affirmation.service';
import { ConfirmationService } from 'primeng/api';
import { LoadingService } from '../../../../core/services/loading.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { AgePipe } from '../../../../core/pipes/age.pipe';
import { Tooltip } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { WelcomePartyPdfComponent } from '../welcome-party-pdf/welcome-party-pdf.component';
import { AndParticipantHealthComponent } from '../and-participant-health/and-participant-health.component';
import { AndParticipantHealthServerComponent } from '../and-participant-health-server/and-participant-health-server.component';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'app-list-detail-interior-health-table',
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    MessageModule,
    AgePipe,
    Tooltip,
    ConfirmDialogModule,
    RadioButtonModule,
    Tag
  ],
  templateUrl: './list-detail-interior-health-table.component.html',
  styleUrl: './list-detail-interior-health-table.component.scss'
})
export class ListDetailInteriorHealthTableComponent {
  public isLoading: boolean = false;
  public data: responseAffirmationList[] = [];
  @Input({ required: true }) affirmation_id!: string;
  ref!: DynamicDialogRef;
  refd!: DynamicDialogRef;
  refsrv!: DynamicDialogRef;
  tipo: string = 'pos';

  constructor(
      private _toastService: ToastService,
      private _dialogService: DialogService,
      private _affirmationService: AffirmationService,
      private _confirmationService: ConfirmationService,
      private _loadingService: LoadingService,
      
    ) { }

    paymentMethods = [
      {
        id: 'card',
        label: 'Pago con tarjeta POS',
        badges: ['Default'],
        logos: ['svg/visa.svg','svg/mastercard.svg']
      },
      {
        id: 'link',
        label: 'Link de pago',
        badges: [],
        logos: ['svg/link.svg']
      },
      {
        id: 'cash',
        label: 'Pago en efectivo',
        badges: [],
        logos: ['svg/efectivo.jpeg']
      }
    ];

    selectedMethod = 'cash';

    ngOnInit() {
      this.getAffirmationList();
    }

    howOpenHealthListServers(){
      this.refsrv = this._dialogService.open(AndParticipantHealthServerComponent, {
        contentStyle: {
          'max-width': '400px',
          'min-width': '400px',
          overflow: 'auto',
        },
        styleClass: 'col458',
        header: 'Agregar Servidores del evento',
        baseZIndex: 10,
        closable: true, 
        data: {
          affirmation_id: this.affirmation_id
        }
      });
  
      this.refsrv.onClose.subscribe((data: boolean) => {
        if (data) {
          this.getAffirmationList();
        }
      });
    }

    howOpenPdf(type: number){
        this.refd = this._dialogService.open(WelcomePartyPdfComponent, {
          width: '60vw',
          height: '100%',
          styleClass: 'col458',
          header: 'Reporte de retiro de sanidad interior',
          baseZIndex: 10,
          closable: true, 
          data: { type, affirmation_id: this.affirmation_id },
          // Desactiva el auto enfoque
          focusOnShow: false,
          
        });
    } 


    howOpenHealthList(){
      this.refd = this._dialogService.open(AndParticipantHealthComponent, {
        width: '60vw',
        //height: '100%',
        styleClass: 'col458',
        header: 'Agregar participantes al evento',
        baseZIndex: 10,
        closable: true, 
        data: { affirmation_id: this.affirmation_id },
        // Desactiva el auto enfoque
        focusOnShow: false,
      });

      this.refd.onClose.subscribe((data: boolean) => {
        if (data) {
          this.getAffirmationList();
        }
      });


  }





 
    onDeleteActivity(affirmation: any){
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
          this._affirmationService.deleteAffirmationsHealdth(affirmation.people_id, affirmation.affirmation_id)
          .pipe(finalize(() => this._loadingService.onHideLoading()))
          .subscribe({
           next: (_) => {
             this._toastService.show({
               severity: 'success',
               summary: 'Participante removido ',
               detail: `El participante fue removido de la lista`,
             });
                 this.getAffirmationList();
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

    onActivateActivityCandell(affirmation: any){
      this._confirmationService.confirm({
        key: 'confirmDeleteDialog',
        message: `Se modificará la asistencia del participante <br>${ affirmation.person.names } ${ affirmation.person.surname }`,
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
          this._affirmationService.updateAssistanceHealth(affirmation.people_id, affirmation.affirmation_id, 'cancel')
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




    onActivateActivity(affirmation: any){
      this._confirmationService.confirm({
        header: 'Confirmar acción',
        message: `¿Seguro que deseas realizar esta acción?`,
        accept: () => {
          this._loadingService.onDisplayLoading();
          this._affirmationService.updateAssistanceHealth(affirmation.people_id, affirmation.affirmation_id, this.selectedMethod)
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
            }
          })
        }
      });
    }

    getAffirmationList() {
      this.isLoading = true;
      this._affirmationService
         .getAllAfirmationListHealth(this.affirmation_id)
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
