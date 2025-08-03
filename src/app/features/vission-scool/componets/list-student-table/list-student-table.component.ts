import { Component, QueryList, ViewChildren } from '@angular/core';
import { SectionHeaderComponent } from '../../../../core/components/section-header/section-header.component';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Pagination } from '../../../../core/interfaces/pagination.interface';
import { responseListStudent } from '../../interfaces/response.list-student.interface';
import { MenuItem } from 'primeng/api';
import { combineLatest, finalize, map, Subject, Subscription, takeUntil } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { VissionScoolService } from '../../service/vission-scool.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { environment } from '../../../../../environments/environment';
import { ImageModule } from 'primeng/image';
import { AgePipe } from '../../../../core/pipes/age.pipe';
import { AndParticipantStudentComponent } from '../and-participant-student/and-participant-student.component';
import { PaginatorModule } from 'primeng/paginator';
import { WelcomePartyPdfComponent } from '../../../affirmation/components/welcome-party-pdf/welcome-party-pdf.component';
interface RouteData {
  period_id?: string;
  currentPage?: number;
  itemsPerPage?: number;
  [key: string]: any;
}

@Component({
  selector: 'app-list-student-table',
  imports: [
    CommonModule,
    TableModule,
    AvatarModule,
    ImageModule,
    AgePipe,
    PaginatorModule
  ],
  templateUrl: './list-student-table.component.html',
  styleUrl: './list-student-table.component.scss'
})
export class ListStudentTableComponent {
  @ViewChildren('imgPreview') previewImgs!: QueryList<any>;
    public paginationParams: Pagination = {
      currentPage: 1,
      itemsPerPage: 10,
    };
  
    public data: responseListStudent = {
      period: [],
      pagination: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 0,
      },
    };

    private period_id: string = '';
   private _destroy$ = new Subject<void>();
    public menuItems: { [key: string]: MenuItem[] } = {};
    public activatedRouteSubs!: Subscription;
    public isLoading: boolean = false;
    ref!: DynamicDialogRef;
    avatarLoadError: { [identity: string]: boolean } = {};
    public url_server = environment.api;

    constructor(
      private _vissionScoolService: VissionScoolService,
      private _router: Router,
      private _activatedRoute: ActivatedRoute,
      private _dialogService: DialogService,
    ){}

    ngOnInit() {
      // this._activatedRoute.params
      //       .pipe(takeUntil(this._destroy$))
      //       .subscribe(({ period_id: period_id = ''}) => {
      //         this.period_id = period_id; 
      //         this.getAllStudent();
      // });

      // this.activatedRouteSubs = this._activatedRoute.queryParams.subscribe(
      // (params: Pagination) => {
      //   this.getAllStudent();
      // }
    //);

        combineLatest([
          this._activatedRoute.params,
          this._activatedRoute.queryParams
        ])
        .pipe(
          map(([params, queryParams]) => ({
            ...params,
            ...queryParams
          }) as RouteData),
          takeUntil(this._destroy$)
        )
        .subscribe((routeData) => {
          
          
          const period_id = routeData.period_id || '';
          this.period_id = period_id; 

          if(routeData.currentPage){
              this.paginationParams = {
                currentPage: Number(routeData.currentPage),
                itemsPerPage: routeData.itemsPerPage
              }
          }

          console.log(this.paginationParams);

          

          this.getAllStudent();
        });
    }


    howOpenPdf(type: number){
 
                this.ref = this._dialogService.open(WelcomePartyPdfComponent, {
                  width: '60vw',
                  height: '100%',
                  styleClass: 'col458',
                  header: 'Reporte de asistencia',
                  baseZIndex: 10,
                  closable: true, 
                  data: { type, period_id: this.period_id },
                  // Desactiva el auto enfoque
                  focusOnShow: false,
                });
      }


    howOpenStudentList(){
          this.ref = this._dialogService.open(AndParticipantStudentComponent, {
            width: '60vw',
            //height: '100%',
            styleClass: 'col458',
            header: 'Agregar participantes al evento',
            baseZIndex: 10,
            closable: true, 
            data: { period_id: this.period_id },
            // Desactiva el auto enfoque
            focusOnShow: false,
          });
    
          this.ref.onClose.subscribe((data: boolean) => {
            if (data) {
              this.getAllStudent();
            }
          });
      }


    getAllStudent() {
      this.isLoading = true;
      this._vissionScoolService
        .getAllPaginations(this.paginationParams, this.period_id)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (dts_stdent) => {
            this.data = dts_stdent;
          },
          error: (error: HttpErrorResponse) => {
            const detail =
              error.status === 0
                ? 'No se puede realizar la conexión al servidor'
                : error.error?.message || error.message;
          },
        })
    }

    mostrarPreview(identity: string) {
      const target = this.previewImgs.find(ref =>
        ref.el.nativeElement.getAttribute('data-identity') === identity
      );
      if (target) {
        // Encuentra el botón que abre el preview y simula clic
        const btn = target.el.nativeElement.querySelector('.p-image-preview-mask');
        if (btn) {
          btn.click();
        } else {
          console.warn('Botón de preview no encontrado para', identity);
        }
      } else {
        console.warn('No se encontró la imagen preview para', identity);
      }
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
