import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { TableModule } from 'primeng/table';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { VissionScoolService } from '../../service/vission-scool.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { ActivatedRoute } from '@angular/router';
import { Classes, responseStudent } from '../../interfaces/response.student.interface';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from '../../../../core/services/toast.service';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { environment } from '../../../../../environments/environment';
import { DropdownModule } from 'primeng/dropdown';
 import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-assistance-student',
  imports: [
    CommonModule,
    TableModule,
    ChipModule,
    ButtonModule,
    InputSwitchModule,
    FormsModule,
    NgxSpinnerModule,
    ToastModule,
    AvatarModule,
    DropdownModule,
    ConfirmDialogModule
  ], 
  templateUrl: './assistance-student.component.html',
  styleUrl: './assistance-student.component.scss'
})
export class AssistanceStudentComponent {
 
  ref!: DynamicDialogRef;
  isLoading: boolean = false;
  private period_id: string = '';
  public responseStudent: responseStudent;
  public attendance: boolean = false;
  avatarLoadError: { [identity: string]: boolean } = {};
  public url_server = 'http://vision.tureinoaqui.hn/api' //environment.api;
  public classes: Classes;
  public selection: string = '';
  constructor(
    private _dialogService: DialogService,
    private _vissionScoolService: VissionScoolService,
    private _loadingService: LoadingService,
    private _activatedRoute: ActivatedRoute,
    private _ngxSpinner: NgxSpinnerService,
    private _toastService: ToastService,
    private messageService: MessageService,
    private _confirmationService: ConfirmationService,
    
){}

  ngOnInit() {
    
    this._activatedRoute.params
            .subscribe(({ period_id: period_id = ''}) => {
              this.period_id = period_id; 
              this.getAllStudent();
      });


  }

  alertSave() {
      this._confirmationService.confirm({
        key: 'confirmDeleteDialog',
        message: `Se envió asistencia de la clase \n${ this.classes.scoolClasses.name } puedes actualizar datos enviando nuevamente la asistencia o seleccionando otra clase`,
        header: 'Asistencia enviada',
        acceptIcon: 'none',
        rejectIcon: 'none',
        acceptLabel: 'Confirmar', 
        rejectLabel: 'Cancelar',
        rejectVisible: false,
        acceptVisible: false,
        acceptButtonStyleClass:
          'mt-3 m-1   !w-full bg-PRIMARY_COLOR border-[0px] h-[47px] flex items-center justify-center text-[17px] text-white font-bold rounded-full',
        rejectButtonStyleClass:
          'mt-3 m-1   !w-full bg-RED_STRONG border-[0px] h-[47px] flex items-center justify-center text-[17px] text-white font-bold rounded-full',
        accept: () => {}
      })
  }


  modifClass(classe: any){
     this.classes =  this.responseStudent.classes.find((e)=> e.scool_class_id === classe.value);
 
     this.getStudentMarking(this.classes.scool_class_id);
  }


  getStudentMarking(scool_class_id: string){
    this._ngxSpinner.show();
    this._vissionScoolService
      .getAllEvaluationssMarking(this.period_id, scool_class_id)
      .pipe(finalize(() => {
        this._ngxSpinner.hide();
        this.isLoading = true;
      }))
      .subscribe({
        next: (response) => {
           for (const a of this.responseStudent.student ) {
            a.asistencia = false;
            const match = response.find(b =>
              b.period_id === a.period_id && b.people_id === a.people_id && b.asistencia === true
            );
 
            if (match) {
              a.asistencia = match.asistencia;
            }
          }
        },
        error: (error: HttpErrorResponse) => {
            const detail =
              error.status === 0
                ? 'No se puede realizar la conexión al servidor'
                : error.error?.message || error.message;
        },
      })
  }

   getAllStudent() {
      this.isLoading = true;
      this._ngxSpinner.show();

      this._vissionScoolService
        .getAllEvaluationss(this.period_id)
        .pipe(finalize(() => {
          this._ngxSpinner.hide();
          this.isLoading = true;
        }))
        .subscribe({
          next: (response) => {
             this.responseStudent = response;

             this.responseStudent.student = this.responseStudent.student.map(alumno => ({
                ...alumno,
                asistencia: false,

                color: this.colorPorLetra(this.getInicial(alumno.person.names))
             }));

             this.classes =  this.responseStudent.classes.find((e)=> e.status === false);
             this.selection = this.classes.scool_class_id;

             
          },
          error: (error: HttpErrorResponse) => {
            const detail =
              error.status === 0
                ? 'No se puede realizar la conexión al servidor'
                : error.error?.message || error.message;
          },
        })
    }

  getInicial(nombre: string): string {
    return nombre.charAt(0).toUpperCase();
  }

  colorPorLetra(letra: string): string {
    const colores: { [key: string]: string } = {
      A: '#3b82f6', // azul
      B: '#10b981', // verde
      C: '#f97316', // naranja
      D: '#6366f1', // morado
      E: '#ef4444', // rojo
      F: '#14b8a6', // teal
      G: '#eab308', // amarillo
      H: '#ec4899', // rosa
      I: '#8b5cf6',
      J: '#22c55e',
      K: '#f43f5e',
      L: '#0ea5e9',
      M: '#d946ef',
      N: '#facc15',
      O: '#4f46e5',
      P: '#a855f7',
      Q: '#06b6d4',
      R: '#f59e0b',
      S: '#dc2626',
      T: '#7c3aed',
      U: '#16a34a',
      V: '#0284c7',
      W: '#ea580c',
      X: '#9333ea',
      Y: '#3f6212',
      Z: '#be123c'
    };

    return colores[letra] || '#6b7280'; // gris por defecto
  }

  saveOfAssistence() {
    const data = this.responseStudent.student.map(alumno => ({
                 period_id: alumno.period_id,
                 people_id: alumno.people_id,
                 asistencia: alumno.asistencia,
                 scool_class_id: this.classes.scool_class_id
             }));
this._ngxSpinner.show();
    this._vissionScoolService.saveStudenAttendance(data)
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
          summary: `Asistencia enviada correctamente`,
          detail: `Se envio datos de asistencia de la clase.`,
        });
         this.attendance = true;
         this._ngxSpinner.hide();
         this.alertSave();
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
