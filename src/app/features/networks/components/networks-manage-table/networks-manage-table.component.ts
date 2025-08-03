import { Component } from '@angular/core';
import { Pagination } from '../../../../core/interfaces/pagination.interface';
import { responseNetwork } from '../../interfaces/response.network.interface';
import { MenuItem } from 'primeng/api';
import { finalize, Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../../core/services/toast.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NetworksService } from '../../services/networks.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { PaginatorModule } from 'primeng/paginator';
import { DebounceDirective } from '../../../../core/directives/debounce.directive';
import { MessageModule } from 'primeng/message';
import { HttpErrorResponse } from '@angular/common/http';
import { NewNetworkComponent } from '../new-network/new-network.component';
import { Tooltip } from 'primeng/tooltip';
import { EditNetworkComponent } from '../edit-network/edit-network.component';
import { Networks } from '../../../../core/interfaces/network.interface';
import { EncryptPipe } from '../../../../core/pipes/encrypt.pipe';
 
@Component({
  selector: 'app-networks-manage-table',
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
    Tooltip,
    RouterLink,
    EncryptPipe
  ],
  templateUrl: './networks-manage-table.component.html',
  styleUrl: './networks-manage-table.component.scss'
})
export class NetworksManageTableComponent {
  public paginationParams: Pagination = {
    currentPage: 1,
    itemsPerPage: 10,
  };

  public data: responseNetwork = {
    networks: [],
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
  dialogRef: DynamicDialogRef | undefined;
  public secretKey = 'm4nu3lGuzm4n1993';

  constructor(
    private _router: Router,
    private _toastService: ToastService,
    private _dialogService: DialogService,
    private _activatedRoute: ActivatedRoute,
    private _networkService: NetworksService
  ) { }

  ngOnInit() {
    this.activatedRouteSubs = this._activatedRoute.queryParams.subscribe(
      (params: Pagination) => {
        this.getNetwoksPaginations();
      }
    );
  }

 

  getNetwoksPaginations() {
    this.isLoading = true;
    this._networkService
      .getAllPaginations(this.paginationParams)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (dts_person) => {
          this.data = dts_person;
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

  onMapMenu() {
    this.menuItems = {};
    for (let network of this.data.networks)
      this.menuItems[network.id] = [
        {
          label: 'Casas de Avivamiento',
          //command: () => this.OnGetHomes(periods),
        },
        {
          label: 'Agregar casa de Avivamiento',
          //command: () => this.OnAddtHomes(periods),
        },
      ];
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




  openAddNetworks() {
    this.ref = this._dialogService.open(NewNetworkComponent, {
      contentStyle: {
        'max-width': '400px',
        'min-width': '400px',
        overflow: 'auto',
      },
      styleClass: 'col458',
      header: 'Agregar nueva red',
      baseZIndex: 10,
    });

    this.ref.onClose.subscribe((data: boolean) => {
      if (data) {
        this.navigate();
      }
    });
  }


  editRegister(data: Networks) {
    this.dialogRef = this._dialogService.open(EditNetworkComponent, {
      width: '400px',
      header: `Editar Registro`,
      data,
      focusOnShow: false,
    });

    this.dialogRef.onClose.subscribe((res) => {

      if (res) {
        this.getNetwoksPaginations();
      }
    });
  }

  


  onSearch() {
    this.navigate();
  }
}
