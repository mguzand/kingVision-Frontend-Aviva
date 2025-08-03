import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NetworksService } from '../../services/networks.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { ToastService } from '../../../../core/services/toast.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-adit-group',
  imports: [
    InputMaskModule,
    InputTextModule,
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    EditorModule,
  ],
  templateUrl: './adit-group.component.html',
  styleUrl: './adit-group.component.scss'
})
export class AditGroupComponent {
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
    const data = this.config.data;
    console.log(data);
    
    this.form = this._fb.group({
      name: [data.name, Validators.required],
      address: [data.address, Validators.required],
      id: [data.id, Validators.required],
    });
  }


  onSubmit() {
    this._loadingService.onDisplayLoading();
    this._NetworwService.onEditGroups(this.form.value)
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
