import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { NetworksService } from '../../services/networks.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { ToastService } from '../../../../core/services/toast.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EditorModule } from 'primeng/editor';
import { CardMapComponent } from '../../../components/card-map/card-map.component';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-group',
  imports: [
    InputMaskModule,
    InputTextModule,
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    EditorModule,
    CardMapComponent
  ],
  templateUrl: './add-group.component.html',
  styleUrl: './add-group.component.scss'
})
export class AddGroupComponent {

  public form!: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _NetworwService: NetworksService,
    private _loadingService: LoadingService,
    private _toastService: ToastService,
    public ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this._fb.group({
      name: [null, Validators.required],
      address: [null, Validators.required],
      network_id: [this.config.data.network_id, Validators.required],
      lat: [null, Validators.required],
      lng: [null, Validators.required]
    });
  }

  setLatLng(e: any) {
    // // Establecemos en el formulario los valores de lat y lng
    this.form.patchValue({ ...e });
  }

  //➔➔➔➔➔➔➔Validate of Network id number 
  get isValidateName() {
    return (
      this.form?.get('name')?.touched &&
      this.form.get('name')?.hasError('required')
    );
  }

  onSubmit() {
    this._loadingService.onDisplayLoading();
    this._NetworwService.onCreateGroups(this.form.value)
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
            detail: `${this.form.value.name}, ha sido creada correctamente.`,
          });
          this.ref.close(true);
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


  closeModal(): void {
    this.ref.close();
  }






}
