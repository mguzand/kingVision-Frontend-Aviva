import { CommonModule } from '@angular/common';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { DebounceDirective } from '../../../../core/directives/debounce.directive';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { AgePipe } from '../../../../core/pipes/age.pipe';
import { AvatarModule } from 'primeng/avatar';
import { ImageModule } from 'primeng/image';
import { Pagination } from '../../../../core/interfaces/pagination.interface';
import { environment } from '../../../../../environments/environment';
import { ResponsePeron } from '../../../person/interfaces/person.interface';
import { MenuItem } from 'primeng/api';
import { finalize, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../../core/services/toast.service';
import { DialogService } from 'primeng/dynamicdialog';
import { PersonService } from '../../../person/services/person.service';
import { HttpErrorResponse } from '@angular/common/http';
import { InputSwitchModule } from 'primeng/inputswitch';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-assistance',
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
    DropdownModule,
    AgePipe,
    AvatarModule,
    ImageModule,
    InputSwitchModule
  ],
  templateUrl: './assistance.component.html',
  styleUrl: './assistance.component.scss'
})
export class AssistanceComponent {
    public paginationParams: Pagination = {
    currentPage: 1,
    itemsPerPage: 100,
  };

  public person_type: any[] = [];
  public url_server = environment.api;
  avatarLoadError: { [identity: string]: boolean } = {};
  event_id: string = '9260ccd4-6d53-4053-8e7e-1fe489312247';

  public data: ResponsePeron = {
    person: [],
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

  @ViewChildren('imgPreview') previewImgs!: QueryList<any>;
  imagenSeleccionada = '';

  constructor(
    private _router: Router,
    private _toastService: ToastService,
    private _dialogService: DialogService,
    private _activatedRoute: ActivatedRoute,
    private _personService: PersonService,
    private _eventsService:  EventsService
  ) { }

  ngOnInit() {
    this.activatedRouteSubs = this._activatedRoute.queryParams.subscribe(
      (params: Pagination) => {
        this.getPersonPaginations();
      }
    );

    this.person_type = [
      { register_type: 'Pastor' },
      { register_type: 'Ministro' },
      { register_type: 'Anciano' },
      { register_type: 'Diacono' },
      { register_type: 'Lider' },
      { register_type: 'Discipulo' },
      { register_type: 'Miembro' },
      { register_type: 'Nuevo Creyente' },
      { register_type: 'Empresario' },
    ];


  }


  onStatusChange(person: any) {
     const updatedStatus = person.status;
     this._eventsService.updateStatus(person.id, updatedStatus, this.event_id).subscribe({
        next: () => {
          this._toastService.show({
            severity: 'success',
            summary: 'Assistencia Registrada',
            detail:
              'Se registro la asistencia correctamente',
          });
        },

        error: () => {
          this._toastService.show({
            severity: 'error',
            summary: 'Error al registrar asistencia',
            detail: 'No se pudo registrar la asistencia, intente nuevamente',
          });
          person.status = !updatedStatus;
        }
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

  


  getPersonPaginations() {
    this.isLoading = true;
    this._personService
      .getAllAssistance(this.paginationParams, this.event_id)
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
    for (let person of this.data.person)
      this.menuItems[person.id] = [
        {
          label: 'Editar registro',
          icon: 'pi pi-pen-to-square',
          command: () => this._router.navigate(['/person', person.id,'general-information' ]),
        },
      ];
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
}
