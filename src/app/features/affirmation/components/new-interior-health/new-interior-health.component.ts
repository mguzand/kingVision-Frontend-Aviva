import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { LoadingService } from '../../../../core/services/loading.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { AffirmationService } from '../../services/affirmation.service';
import { ToastService } from '../../../../core/services/toast.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { InputMaskModule } from 'primeng/inputmask';

@Component({
  selector: 'app-new-interior-health',
  imports: [ReactiveFormsModule, CommonModule, DatePickerModule, InputTextModule, InputMaskModule],
  templateUrl: './new-interior-health.component.html',
  styleUrl: './new-interior-health.component.scss'
})
export class NewInteriorHealthComponent {
  public form!: FormGroup; 

  constructor( private _fb: FormBuilder,
               private _loadingService: LoadingService,
               public ref: DynamicDialogRef,
               private _affirmationService: AffirmationService,
               private _toastService: ToastService,
             ){}
  

  ngOnInit(): void {
    this.initForm();
    
  }

   

  initForm() { 
    this.form = this._fb.group({
      date: [null, Validators.required],
      type_id: [2, Validators.required],
      name: [null, Validators.required],
      amount: [null, Validators.required],
    });
  }

  

  onSubmit(){
    this._loadingService.onDisplayLoading();
    this._affirmationService.newAffirmation(this.form.value)
    .pipe(
        finalize(() => {
          this._loadingService.onHideLoading()
        })
    )
    .subscribe({
      next: (_) => {
        this._toastService.show({
          severity: 'success',
          summary: `${ this.form.value.name } creado correctamente`,
          detail: `Se creo el envento de afirmación correctamente`,
        });
        this.ref.close(true);
      },
      error: (error: HttpErrorResponse) => {
        const detail =
            error.status === 0
              ? 'No se puede realizar la conexión al servidor'
              : error.error?.message || error.message;

        this._toastService.show({
          severity: 'error',
          summary: 'Error',
          detail
        });
      },
    })
  }

  closeModal(): void {
    this.ref.close();
  }

}
