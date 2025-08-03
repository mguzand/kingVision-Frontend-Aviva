import { CommonModule } from '@angular/common';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { DebounceDirective } from '../../../../core/directives/debounce.directive';
import { MessageModule } from 'primeng/message';
import { Tooltip } from 'primeng/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Pagination } from '../../../../core/interfaces/pagination.interface';
import { ProffesionResponse } from '../../interfaces/profession.interface';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { finalize, Subscription } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastService } from '../../../../core/services/toast.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { ProfessionService } from '../../services/profession.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AgePipe } from '../../../../core/pipes/age.pipe';
import { DatePickerModule } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';
import { responseMeetings } from '../../../person/interfaces/meetings.interface';
import { MeetingsService } from '../../../person/services/meetings.service';
import { WelcomePartyPdfComponent } from '../../../affirmation/components/welcome-party-pdf/welcome-party-pdf.component';
import { TagModule } from 'primeng/tag';
import { MenuModule } from 'primeng/menu';
import { AssignmentComponent } from '../assignment/assignment.component';
import { AvatarModule } from 'primeng/avatar';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-profession-manage-table',
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    PaginatorModule,
    DebounceDirective,
    MessageModule,
    MenuModule,
    TagModule,
    ConfirmDialogModule,
    AgePipe,
    DatePickerModule,
    DropdownModule,
    AvatarModule
  ],
  templateUrl: './profession-manage-table.component.html',
  styleUrl: './profession-manage-table.component.scss'
})
export class ProfessionManageTableComponent {
    public paginationParams: Pagination = {
      currentPage: 1,
      itemsPerPage: 10,
    };
  
    public data: ProffesionResponse = {
      proffesion: [],
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
    refAssignment!: DynamicDialogRef;
    public url_server = environment.api;

    avatarLoadError: { [identity: string]: boolean } = {};
    @ViewChildren('imgPreview') previewImgs!: QueryList<any>;
 
    public dataMeetings: responseMeetings[] = []; 

    constructor(
      private _router: Router,
      private _toastService: ToastService,
      private _dialogService: DialogService,
      private _activatedRoute: ActivatedRoute, 
      private _confirmationService: ConfirmationService,
      private _loadingService: LoadingService,
      private _ProfessionService: ProfessionService,
      private meetingsService: MeetingsService
    ) { }


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


    ngOnInit() {
      this.activatedRouteSubs = this._activatedRoute.queryParams.subscribe(
        (params: Pagination) => {
         if(params){
          this.paginationParams.search = params.search ? new Date(params.search)  : null
         }
          
          this.getProfessionPaginations();
        }
      );

      // this.meetingsService.getMeetings().subscribe({
      //   next: (dataMeetings) => (this.dataMeetings = dataMeetings),
      // });
    }
 

    howOpenPdf(type: number){
      if(!this.paginationParams.search) 
        return;


            this.ref = this._dialogService.open(WelcomePartyPdfComponent, {
              width: '60vw',
              height: '100%',
              styleClass: 'col458',
              header: 'Reporte de conversos',
              baseZIndex: 10,
              closable: true, 
              data: { type, search: this.paginationParams.search },
              // Desactiva el auto enfoque
              focusOnShow: false,
              
            });
    }


    async AddAssignment(id_person: string){
      this.refAssignment = this._dialogService.open(AssignmentComponent, {
          width: '400px',
          header: `Asignar casa de Avivamiento`,
          data: { id_person},
          focusOnShow: false,
          closable: true, 
        });
    
        this.refAssignment.onClose.subscribe((res) => {
          if (res) {
            this.getProfessionPaginations();
          }
        });
    }

    




    getProfessionPaginations() {
      if(!this.paginationParams.search) 
        return;

      this.isLoading = true;
      this._ProfessionService
        .getAllPaginations(this.paginationParams)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (dts_proffesion) => {
            this.data = dts_proffesion;
            this.mapData();
          },
          error: (error: HttpErrorResponse) => {
            const detail =
              error.status === 0
                ? 'No se puede realizar la conexión al servidor'
                : error.error?.message || error.message;
          },
        })
    }


    mapData() {
    this.menuItems = {};
    for (let data of this.data.proffesion)
      this.menuItems[data.people_id] = [
        {
          label: 'Asignar casa de Avivamiento',
          icon: 'pi pi-pencil',
          disabled: data.person.group_id ? true : false,
          command: () => this.AddAssignment(data.people_id),
        },
        {
          label: 'Editar asignación',
          icon: 'pi pi-pencil',
          disabled: data.person.group_id ? false : true
          //command: () => this.showUpdateDialog(studies),  Assignment
        }
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

    onSearch() {
      this.navigate();
    }


    
}
