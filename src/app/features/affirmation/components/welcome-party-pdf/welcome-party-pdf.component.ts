import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoadingService } from '../../../../core/services/loading.service';
import { AffirmationService } from '../../services/affirmation.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxExtendedPdfViewerModule, ScrollModeType } from 'ngx-extended-pdf-viewer';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ProfessionService } from '../../../profession-of-faith/services/profession.service';


@Component({
  selector: 'app-welcome-party-pdf',
  imports: [CommonModule, NgxExtendedPdfViewerModule],
  standalone: true,
  templateUrl: './welcome-party-pdf.component.html',
  styleUrl: './welcome-party-pdf.component.scss'
})
export class WelcomePartyPdfComponent {
  public blob!: Blob | null;
  public page = 1;
  public pageLabel!: string;
  public zoom: number | string;
  public scrollMode: ScrollModeType = ScrollModeType.vertical;

  constructor(private _loadingService: LoadingService, 
              private _affirmationService: AffirmationService,
              private config: DynamicDialogConfig,
              private _ProfessionService: ProfessionService,
            ){}

  ngOnInit(): void {
    const data = this.config.data?.type || 1;
 
      if(data===1){
        const affirmation_id = this.config.data.affirmation_id;
        this.getAffirmationList(affirmation_id);
      }else if(data===2){
        const affirmation_id = this.config.data.affirmation_id;
        this.getAffirmationListHealth(affirmation_id);
      }else if(data===3){
        const search = this.config.data.search;
        this.getProffesionPdf(search);
      }else if(data===4){
        const search = this.config.data.search;
        this.getProffesionPdfExt(search);
      }else if(data===5){
        const affirmation_id = this.config.data.affirmation_id;
        this.getAffirmationListHealthInternal(affirmation_id);
      }else if(data===6){
        const period_id = this.config.data.period_id;
        this.getReportAttendedStudent(period_id);
      }else if(data===7){
        const period_id = this.config.data.period_id;
        this.getReportAttendedStudentGeneral(period_id);
      }
  }

  getReportAttendedStudentGeneral(period_id: string) {
    this._loadingService.onDisplayLoading();
    this._affirmationService
       .getReportAttendedStudentGeneral(period_id)
      .pipe(finalize(() => ( this._loadingService.onHideLoading())))
      .subscribe({
        next: (res) => {
          this.blob = res;
          const url = URL.createObjectURL(res);
        },
        error: (error: HttpErrorResponse) => {
          const detail =
            error.status === 0
              ? 'No se puede realizar la conexión al servidor'
              : error.error?.message || error.message;
        },
      })
   }


  getReportAttendedStudent(period_id: string) {
    this._loadingService.onDisplayLoading();
    this._affirmationService
       .getReportAttendedStudent(period_id)
      .pipe(finalize(() => ( this._loadingService.onHideLoading())))
      .subscribe({
        next: (res) => {
          this.blob = res;
          const url = URL.createObjectURL(res);
        },
        error: (error: HttpErrorResponse) => {
          const detail =
            error.status === 0
              ? 'No se puede realizar la conexión al servidor'
              : error.error?.message || error.message;
        },
      })
   }




  getAffirmationListHealthInternal(affirmation_id: string) {
    this._loadingService.onDisplayLoading();
    this._affirmationService
       .getPdfAffirmationHealthInternal(affirmation_id)
      .pipe(finalize(() => ( this._loadingService.onHideLoading())))
      .subscribe({
        next: (res) => {
          this.blob = res;
          const url = URL.createObjectURL(res);
        },
        error: (error: HttpErrorResponse) => {
          const detail =
            error.status === 0
              ? 'No se puede realizar la conexión al servidor'
              : error.error?.message || error.message;
        },
      })
   }



  getProffesionPdfExt(affirmation_id: string) {
    this._loadingService.onDisplayLoading();
    this._ProfessionService
       .getProffesionPdfExt(affirmation_id)
      .pipe(finalize(() => ( this._loadingService.onHideLoading())))
      .subscribe({
        next: (res) => {
          this.blob = res;
          const url = URL.createObjectURL(res);
        },
        error: (error: HttpErrorResponse) => {
          const detail =
            error.status === 0
              ? 'No se puede realizar la conexión al servidor'
              : error.error?.message || error.message;
        },
      })
   }




  getProffesionPdf(affirmation_id: string) {
    this._loadingService.onDisplayLoading();
    this._ProfessionService
       .getPdfAProfession(affirmation_id)
      .pipe(finalize(() => ( this._loadingService.onHideLoading())))
      .subscribe({
        next: (res) => {
          this.blob = res;
          const url = URL.createObjectURL(res);
        },
        error: (error: HttpErrorResponse) => {
          const detail =
            error.status === 0
              ? 'No se puede realizar la conexión al servidor'
              : error.error?.message || error.message;
        },
      })
   }



  getAffirmationListHealth(affirmation_id: string) {
    this._loadingService.onDisplayLoading();
    this._affirmationService
       .getPdfAffirmationHealth(affirmation_id)
      .pipe(finalize(() => ( this._loadingService.onHideLoading())))
      .subscribe({
        next: (res) => {
          this.blob = res;
          const url = URL.createObjectURL(res);
        },
        error: (error: HttpErrorResponse) => {
          const detail =
            error.status === 0
              ? 'No se puede realizar la conexión al servidor'
              : error.error?.message || error.message;
        },
      })
   }


   getAffirmationList(affirmation_id: string) {
    this._loadingService.onDisplayLoading();
    this._affirmationService
       .getPdfAffirmation(affirmation_id)
      .pipe(finalize(() => ( this._loadingService.onHideLoading())))
      .subscribe({
        next: (res) => {
          this.blob = res;
          const url = URL.createObjectURL(res);
          
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
