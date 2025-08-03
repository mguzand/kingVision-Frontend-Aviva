import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { NetworksService } from '../../services/networks.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { ToastService } from '../../../../core/services/toast.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-network',
  imports: [
    InputMaskModule,
    InputTextModule,
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
  ],
  templateUrl: './edit-network.component.html',
  styleUrl: './edit-network.component.scss'
})
export class EditNetworkComponent {
  public form!: FormGroup;

  constructor(
    private config: DynamicDialogConfig,
    private _fb: FormBuilder,
    private _NetworwService: NetworksService,
    private _loadingService: LoadingService,
    private _toastService: ToastService,
    public ref: DynamicDialogRef
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    const data = this.config.data;
    this.form = this._fb.group({
      id: [data.id, Validators.required],
      number: [data.number, Validators.required],
      name: [data.name, Validators.required],
    });
  }

  //➔➔➔➔➔➔➔Validate of Network id number 
  get isNotValiNnumero_Network() {
    return (
      this.form?.get('number')?.touched &&
      this.form.get('number')?.hasError('required')
    );
  }

  //➔➔➔➔➔➔➔Validar Nombre
  get isNotValidName() {
    return (
      this.form?.get('name')?.touched &&
      this.form.get('name')?.hasError('required')
    );
  }

  onSubmit() {
    this._loadingService.onDisplayLoading();
    this._NetworwService.onEdit(this.form.value)
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
            detail: `${this.form.value.name}, ha sido actualizada correctamente.`,
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
