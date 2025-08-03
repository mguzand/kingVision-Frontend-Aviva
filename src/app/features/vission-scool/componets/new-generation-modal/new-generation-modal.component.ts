import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { FieldsetModule } from 'primeng/fieldset';
import { VissionScoolService } from '../../service/vission-scool.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { catchError, debounceTime, finalize, of, Subject, Subscription, switchMap } from 'rxjs';
import { AutoComplete } from 'primeng/autocomplete';
import { Person } from '../../../../core/interfaces/manage-person.interface';
import { PersonService } from '../../../person/services/person.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { ToastService } from '../../../../core/services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-new-generation-modal',
  imports: [ReactiveFormsModule, 
            CommonModule, 
            DatePickerModule, 
            InputTextModule, 
            FieldsetModule,
            AutoComplete
          ],
  templateUrl: './new-generation-modal.component.html',
  styleUrl: './new-generation-modal.component.scss'
})
export class NewGenerationModalComponent {
  public form!: FormGroup; 
  public dataClass: any = [];
  filteredPeople: Person[] = [];
  private searchSubject = new Subject<string>();
  private subscription: Subscription;

  constructor( 
    private _fb: FormBuilder,
    private _vissionScoolService: VissionScoolService,
    private config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private personService: PersonService,
    private _loadingService: LoadingService,
    private _toastService: ToastService,
  ){}
  
  ngOnInit(): void {
    this.initForm(); 
    this.getData();
  }


  filterPeople(event: any) {
    const query = event.query;
    this.searchSubject.next(query);
  }


  getFullName = (person: any): string => {
    return `${person.names} ${person.surname}`;
  };

 

  getData() { 
      this._vissionScoolService
        .getAllClass(this.config.data.scool_id)
        .subscribe({
          next: (data) => {
             this.dataClass = data;
             this.setPeriods(data);
          },
        });
  }

   public setPeriods(data: any[]): void {
      this.periods.clear();
      for (const items of data) {
          const payment = this._fb.group({
            period: [null, Validators.required],
            id_class: [items.id, Validators.required],
          })
          this.periods.push(payment);  
      }
   }

   closeModal(): void {
    this.ref.close();
  }

 

  initForm() {
    this.form = this._fb.group({
      name: [null, Validators.required],
      in_charge_id: [null, Validators.required],
      vision_scool_id: [this.config.data.scool_id, Validators.required],
      periods: this._fb.array([])
    });


    this.subscription = this.searchSubject.pipe(
      debounceTime(400),
      switchMap(query =>
        this.personService.searchPeople(query).pipe(
          catchError(() => of([]))
        )
      )
    ).subscribe(results => {
      this.filteredPeople = results;
    });

  }

  public get periods(): FormArray {
    return this.form.get('periods') as FormArray;
  }


  onSubmit(){
    this._loadingService.onDisplayLoading();
    this._vissionScoolService.nePeriod(this.form.value)
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
          detail: `Se creo el envento de la escuela de afirmación`,
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



}
