import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { Groups } from '../../../../core/interfaces/groups.interface';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { CommonModule } from '@angular/common';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { AgePipe } from '../../../../core/pipes/age.pipe';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { PersoService } from '../../../../core/services/person.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { finalize } from 'rxjs';
import { ToastService } from '../../../../core/services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AvatarModule } from 'primeng/avatar';
import { ImageModule } from 'primeng/image';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-details-groups-table',
  imports: [
    TableModule,
    IconFieldModule,
    CommonModule,
    InputIconModule,
    InputTextModule,
    AgePipe,
    FormsModule,
    TagModule,
    ToggleSwitchModule,
    AvatarModule,
    ImageModule
  ],
  templateUrl: './details-groups-table.component.html',
  styleUrl: './details-groups-table.component.scss'
})
export class DetailsGroupsTableComponent {
  @Input({ required: true }) data!: Groups;
  @ViewChildren('imgPreview') previewImgs!: QueryList<any>;
  

  public url_server = environment.api;
    avatarLoadError: { [identity: string]: boolean } = {};

    

  constructor(
    private _personService: PersoService,
    private _loadingService: LoadingService,
    private _toastService: ToastService,
){}

  ngOnInit(){
     
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



  ManageHost(host: boolean, person_id: string){
    this._loadingService.onDisplayLoading();
    this._personService.putHostGroup(host, person_id)
      .pipe(
        finalize(() => {
          this._loadingService.onHideLoading()
        })
      )
      .subscribe({
        next: (res) => {
          this._toastService.show({
            severity: 'success',
            summary: 'Correcto',
            detail: `Anfitrion de casa de Avivamiento establecido`,
          });
        },
        error: (err: HttpErrorResponse) => {
          this._toastService.show({
            severity: 'error',
            summary: 'Error',
            detail: err.error.message[0],
          });
        },
      });
  }
}
