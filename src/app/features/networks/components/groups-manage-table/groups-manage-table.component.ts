import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { DebounceDirective } from '../../../../core/directives/debounce.directive';
import { MessageModule } from 'primeng/message';
import { Tooltip } from 'primeng/tooltip';
import { Pagination } from '../../../../core/interfaces/pagination.interface';
import { responseGroup } from '../../interfaces/response.groups.interface';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { finalize, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../../core/services/toast.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NetworksService } from '../../services/networks.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { LoadingService } from '../../../../core/services/loading.service';
import { AddGroupComponent } from '../add-group/add-group.component';
import { AditGroupComponent } from '../adit-group/adit-group.component';
import { LeadersOfGroupComponent } from '../leaders-of-group/leaders-of-group.component';
import { ChipModule } from 'primeng/chip';
import { LeadersService } from '../../services/leaders.service';


@Component({
  selector: 'app-groups-manage-table',
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    MenuModule,
    PaginatorModule,
    DebounceDirective,
    MessageModule,
    TagModule,
    ConfirmDialogModule,
    ChipModule
  ],
  templateUrl: './groups-manage-table.component.html',
  styleUrl: './groups-manage-table.component.scss'
})
export class GroupsManageTableComponent {
  @Input({ required: true }) network_id!: string;

  public paginationParams: Pagination = {
    currentPage: 1,
    itemsPerPage: 10,
  };

  public data: responseGroup = {
    groups: [],
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
  dialogRef!: DynamicDialogRef;
  dialogLeadersRef!: DynamicDialogRef;

  constructor(
    private _router: Router,
    private _toastService: ToastService,
    private _dialogService: DialogService,
    private _activatedRoute: ActivatedRoute,
    private _networkService: NetworksService,
    private _confirmationService: ConfirmationService,
    private _loadingService: LoadingService,
    private _leadersService: LeadersService,
    
  ) { }

  onRemoveChip(people_id: string, group_id: string) {
    this._confirmationService.confirm({
      key: 'confirmDeleteDialog',
      message: '¿Seguro que deseas eliminar lider de casa de Avivamiento?',
      header: 'Confirmar acción',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass:
        'mt-3 m-1   !w-full bg-PRIMARY_COLOR border-[0px] h-[47px] flex items-center justify-center text-[17px] text-white font-bold rounded-full',
      rejectButtonStyleClass:
        'mt-3 m-1   !w-full bg-RED_STRONG border-[0px] h-[47px] flex items-center justify-center text-[17px] text-white font-bold rounded-full',
      accept: () => {
        this._loadingService.onDisplayLoading();
        this._leadersService.deleteLeadersGroup(people_id, group_id)
          .pipe(finalize(() => this._loadingService.onHideLoading()))
          .subscribe({
            next: (_) => {
              this._toastService.show({
                severity: 'success',
                summary: 'Lider removido',
                detail: `El lider fue eliminado de la casa de Avivamiento`,
              });

              this.getGroupPaginations();

            },
            error: (err: HttpErrorResponse) => {
              this._toastService.show({
                severity: 'error',
                summary: 'Error',
                detail: err.error.message,
              });
            },
          })


      },
      reject: () => { },
    });
  }

//LeadersOfGroupComponent
  dialogLeadersRefRegister(data: any) {
    this.dialogLeadersRef = this._dialogService.open(LeadersOfGroupComponent, {
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      contentStyle: {
        'min-width': '400px',
        overflow: 'auto',
      },
      styleClass: 'col458',
      header: `Agregar lider a casa de Avivamiento ${ data.name }`,
      baseZIndex: 10,
      data,
      focusOnShow: false,
    });

    this.dialogLeadersRef.onClose.subscribe((res) => {

      if (res) {
        this.getGroupPaginations();
      }
    });
}




  editRegister(data: any) {
      this.dialogRef = this._dialogService.open(AditGroupComponent, {
        breakpoints: {
          '960px': '75vw',
          '640px': '90vw',
        },
        contentStyle: {
          'min-width': '400px',
          overflow: 'auto',
        },
        styleClass: 'col458',
        header: 'Editar casa de Avivamiento',
        baseZIndex: 10,
        data,
        focusOnShow: false,
      });
  
      this.dialogRef.onClose.subscribe((res) => {
  
        if (res) {
          this.getGroupPaginations();
        }
      });
  }

  onMapMenu() {
    this.menuItems = {};
    for (let groups of this.data.groups)
      this.menuItems[groups.id] = [
        {
          label: 'Editar registro',
          icon: 'pi pi-pen-to-square',
          command: () => this.editRegister(groups),
        },
        {
          label: 'Agregar lider de casa de Avivamiento',
          icon: 'pi pi-user-plus',
          command: () => this.dialogLeadersRefRegister(groups),
        },
        {
          label: groups.status ?  'Dar de baja casa de Avivamiento' : 'Activar casa de Avivamiento',
          icon: groups.status ? 'pi pi-times' : 'pi pi-check' ,
          command: () => this.onDeleteActivity(groups.id),
        },{
          label: 'Detalle de casa de Avivamiento',
          icon: 'pi pi-external-link' ,
          command: () => this._router.navigate(['/network/groups/details', groups.id]),
        },
      ];
  }






  ngOnInit() {
    this.activatedRouteSubs = this._activatedRoute.queryParams.subscribe(
      (params: Pagination) => {
        this.getGroupPaginations();
      }
    );
  }

  openAddGroups() {
    this.ref = this._dialogService.open(AddGroupComponent, {
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      contentStyle: {
        'min-width': '400px',
        overflow: 'auto',
      },
      styleClass: 'col458',
      header: 'Agregar casa de Avivamiento',
      baseZIndex: 10,
      data: { network_id: this.network_id }
    });

    this.ref.onClose.subscribe((data: boolean) => {
      if (data) {
        this.navigate();
      }
    });
  }


  onDeleteActivity(id: string) {
    this._confirmationService.confirm({
      key: 'confirmDeleteDialog',
      message: '¿Seguro que deseas modificar el estado de esta casa de Avivamiento?',
      header: 'Confirmar acción',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass:
        'mt-3 m-1   !w-full bg-PRIMARY_COLOR border-[0px] h-[47px] flex items-center justify-center text-[17px] text-white font-bold rounded-full',
      rejectButtonStyleClass:
        'mt-3 m-1   !w-full bg-RED_STRONG border-[0px] h-[47px] flex items-center justify-center text-[17px] text-white font-bold rounded-full',
      accept: () => {
        this._loadingService.onDisplayLoading();
        this._networkService.updateGroup(id)
          .pipe(finalize(() => this._loadingService.onHideLoading()))
          .subscribe({
            next: (_) => {
              this._toastService.show({
                severity: 'success',
                summary: 'Estado Modificado',
                detail: `El estado de la casa de Avivamiento modificado`,
              });

              const group = this.data.groups.find(g => g.id === id)
              group.status = !group.status;
              this.onMapMenu();


            },
            error: (err: HttpErrorResponse) => {
              this._toastService.show({
                severity: 'error',
                summary: 'Error',
                detail: err.error.message,
              });
            },
          })


      },
      reject: () => { },
    });
  }




  getGroupPaginations() {
    this.isLoading = true;
    this._networkService
      .getAllPaginationsGroups(this.network_id, this.paginationParams)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (dts_groups) => {
          this.data = dts_groups;
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


  getSeverity(status: boolean) {
    switch (status) {
      case true:
        return 'success';
      case false:
        return 'warn';
    }
  }


  getEstadoValue(status: boolean): string {
    return status ? 'Activa' : 'Inactiva';
  }

  onSearch() {
    this.navigate();
  }



}
