import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { NetworksService } from '../../services/networks.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from '../../../../core/services/toast.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { LoadingService } from '../../../../core/services/loading.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-new-network',
  imports: [
    InputMaskModule,
    InputTextModule,
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
  ],
  templateUrl: './new-network.component.html',
  styleUrl: './new-network.component.scss'
})
export class NewNetworkComponent {
  public form!: FormGroup;

  constructor(
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
    this.form = this._fb.group({
      number: [null, Validators.required],
      name: [null, Validators.required],
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
    this._NetworwService.onCreateNetWorks(this.form.value)
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
