import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../../core/services/toast.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { SvgIconPipe } from '../../../../core/pipes/svg-icon.pipe';
import { DatePickerModule } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';
import { MeetingsTypeDropdownFormFieldComponent } from '../meetings-type-dropdown-form-field/meetings-type-dropdown-form-field.component';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ConversionService } from '../../services/conversion.service';

@Component({
  selector: 'app-create-conversion-form',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    InputTextModule,
    SvgIconPipe,
    DatePickerModule,
    DropdownModule,
    MeetingsTypeDropdownFormFieldComponent,
  ],
  templateUrl: './create-conversion-form.component.html',
  styleUrl: './create-conversion-form.component.scss'
})
export class CreateConversionFormComponent {
  @Input({ required: true }) personId!: string;

  // Variable para crear el registro nuevo
  public createConversion!: FormGroup;

  public typeConversion = [
    { value: 1, name: 'Acepto por primera vez' },
    { value: 2, name: 'Reconcilio con Jesús' },
  ];



  constructor(
    private _fb: FormBuilder,
    private _toastService: ToastService,
    private _loadingService: LoadingService,
    private _conversionService: ConversionService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  // Funcion para inicializar el formulario
  initForm() {
    this.createConversion = this._fb.group({
      date_conversion: [null, Validators.required],
      conversion_type: [null, Validators.required],
      network_type: [null, Validators.required],
    });
  }

  get isRequiredDate() {
    return (
      this.createConversion.get('date_conversion')?.touched &&
      this.createConversion.get('date_conversion')?.hasError('required')
    );
  }

  get isRequiredConvertion() {
    return (
      this.createConversion.get('conversion_type')?.touched &&
      this.createConversion.get('conversion_type')?.hasError('required')
    );
  }

  getControl(name: string) {
    return this.createConversion.get(name) as FormControl;
  }


  createConversionData() {
    this._loadingService.onDisplayLoading();
    this._conversionService
      .createConversion({
        ...this.createConversion.value,
        people_id: this.personId,
      })
      .pipe(
        finalize(() => {
          this._loadingService.onHideLoading();
        })
      )
      .subscribe({
        next: (res) => {
          this._toastService.show({
            severity: 'success',
            summary: 'Datos Agregados',
            detail: `Se agrego el registro correctamente`,
          });
          this.createConversion.reset();
          this._conversionService.conversion$.next(res);
        },
        error: (err: HttpErrorResponse) => {
          this._toastService.show({
            severity: 'error',
            summary: 'Error',
            detail: err.error.message,
          });
        },
      });
  }






}
