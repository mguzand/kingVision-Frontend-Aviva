import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { isUUIDv4 } from '../../../../core/helpers/is-uuid.interface';
import { SectionHeaderComponent } from '../../../../core/components/section-header/section-header.component';
import { VissionScoolService } from '../../service/vission-scool.service';
import { Pagination } from '../../../../core/interfaces/pagination.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { ResponsePeriod } from '../../interfaces/response.period.interface';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Dialog } from 'primeng/dialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NewGenerationModalComponent } from '../new-generation-modal/new-generation-modal.component';

@Component({
  selector: 'app-vission-scool-manage-table',
  imports: [
    SectionHeaderComponent,
    CommonModule,
    TableModule,
    PaginatorModule,
    MenuModule,
    ButtonModule,
    CardModule,
    Dialog
  ],
  templateUrl: './vission-scool-manage-table.component.html',
  styleUrl: './vission-scool-manage-table.component.scss'
})
export class VissionScoolManageTableComponent {
  private _destroy$ = new Subject<void>();
  private scool_id: string = '';
  public paginationParams: Pagination = {
      currentPage: 1,
      itemsPerPage: 10,
  };

  public data: ResponsePeriod = {
      period: [],
      pagination: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 0,
      },
  };

  public dataScool;
  public isLoading: boolean = false;
  public menuItems: { [key: string]: MenuItem[] } = {};
  visible: boolean = false;
  public classItinerary:any = [];
  ref!: DynamicDialogRef;

  

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _vissionScoolService: VissionScoolService,
    private _router: Router,
    private _dialogService: DialogService,
  ){}


  openAddGenerations() {
      this.ref = this._dialogService.open(NewGenerationModalComponent, {
        contentStyle: {
          'max-width': '700px',
          'min-width': '700px',
          overflow: 'auto',
        },
        data: {scool_id: this.scool_id},
        styleClass: 'col458',
        header: 'Agregar nuevo evento',
        baseZIndex: 10,
        closable: true,
      });
  
      this.ref.onClose.subscribe((data: boolean) => {
        if (data) {
          this.getPersonPaginations(this.scool_id);
        }
      });
  }


  ngOnInit() {
    this._activatedRoute.params
      .pipe(takeUntil(this._destroy$))
      .subscribe(({ id: id = '' }) => {
        if (id && isUUIDv4(id)){ 
          this.getData(id);
          this.scool_id = id;
        }
      });
  }

  showDialog(data: any) {
        this.classItinerary = data;
        this.visible = true;
  }


  getPersonPaginations(id: string) {
    this.isLoading = true;
    this._vissionScoolService
      .getAll(this.paginationParams, id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (_data) => {
          this.data = _data;
          this.onMapMenu();
        },
        error: (error: HttpErrorResponse) => {
          const detail =
            error.status === 0
              ? 'No se puede realizar la conexión al servidor'
              : error.error?.message || error.message;
        },
      })
  }



  


    getData(id: string){
       this.getDetailClass(id);
       this.getPersonPaginations(id);
    }


    getDetailClass(id: string) {
        this._vissionScoolService
          .detailVission(id)
          .subscribe({
            next: (_dataScool) => {
              this.dataScool = _dataScool;
            },
            error: (error: HttpErrorResponse) => {
              const detail =
                error.status === 0
                  ? 'No se puede realizar la conexión al servidor'
                  : error.error?.message || error.message;
            },
        })
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

  onPageChange(e: any) {
    this.paginationParams.itemsPerPage = e.rows;
    this.paginationParams.currentPage = e.page + 1;
    this.navigate();
  }
    
  onMapMenu() {
    this.menuItems = {};
    for (let data of this.data.period)
      this.menuItems[data.id] = [
        {
          label: 'Itinerario de clases',
          icon: 'pi pi-file-o',
          command: () => this.showDialog(data.classItinerary),
        },
        {
          label: 'Alunnos',
          icon: 'pi pi-users',
          command: () => this._router.navigate(['/vission-scool/student-list', data.id]),
        },
        {
          label: 'Tomar asisencia',
          icon: 'pi pi-users',
          command: () => window.open(`/assistance/${data.id}`, '_blank'),
        },
        {
          label: 'Eliminar',
          icon: 'pi pi-trash',
        },
      ];
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }





}
