import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MessageModule } from 'primeng/message';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { DebounceDirective } from '../../../../core/directives/debounce.directive';
import { Pagination } from '../../../../core/interfaces/pagination.interface';
import { ResponsePeron } from '../../interfaces/person.interface';
import { MenuItem } from 'primeng/api';
import { finalize, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../../core/services/toast.service';
import { DialogService } from 'primeng/dynamicdialog';
import { PersonService } from '../../services/person.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { AgePipe } from '../../../../core/pipes/age.pipe';
import { environment } from '../../../../../environments/environment';
import { AvatarModule } from 'primeng/avatar';
import { Image, ImageModule } from 'primeng/image';

@Component({
  selector: 'app-member-manage-table',
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
    ImageModule
  ],
  templateUrl: './member-manage-table.component.html',
  styleUrl: './member-manage-table.component.scss'
})
export class MemberManageTableComponent {
  public paginationParams: Pagination = {
    currentPage: 1,
    itemsPerPage: 100,
  };

  public person_type: any[] = [];
  public url_server = environment.api;
  avatarLoadError: { [identity: string]: boolean } = {};

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
    private _personService: PersonService
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


  // mostrarPreview(identity: string) {
  //   const target = this.previewImgs.find(imgComp => {
  //     return imgComp?.el?.nativeElement?.getAttribute('data-identity') === identity;
  //   }); 
    
  //   console.log(target.el?.nativeElement);
    
  
  //   const clickableImage = target.el?.nativeElement?.querySelector('.p-image-preview-mask');

  //    clickableImage?.click();
  // }

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
      .getAll(this.paginationParams)
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
