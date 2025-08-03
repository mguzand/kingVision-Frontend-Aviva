import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { LoadingService } from '../../../../core/services/loading.service';
import { ToastService } from '../../../../core/services/toast.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AutoComplete } from 'primeng/autocomplete';
import { Person } from '../../../../core/interfaces/manage-person.interface';
import { catchError, debounceTime, finalize, of, Subject, Subscription, switchMap } from 'rxjs';
import { PersonService } from '../../../person/services/person.service';
import { AffirmationService } from '../../services/affirmation.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-welcome-party-add',
  imports: [
    InputMaskModule,
    InputTextModule,
    CommonModule,
    ReactiveFormsModule,
    AutoComplete,
    ButtonModule,
  ],
  templateUrl: './welcome-party-add.component.html',
  styleUrl: './welcome-party-add.component.scss'
})
export class WelcomePartyAddComponent {
  public form!: FormGroup;
  filteredPeople: Person[] = [];
  private searchSubject = new Subject<string>();
  private subscription: Subscription;
  

  constructor(
    private _fb: FormBuilder,
    private _loadingService: LoadingService,
    private _toastService: ToastService,
    public ref: DynamicDialogRef,
    private personService: PersonService,
    private _affirmationService: AffirmationService,
    private config: DynamicDialogConfig,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    const data = this.config.data;
    this.form = this._fb.group({
      people_id: [null, Validators.required],
      affirmation_id: [data.affirmation_id, Validators.required]
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

 
  getFullName = (person: any): string => {
    return `${person.names} ${person.surname}`;
  };

  onPersonSelected(person: any) {
    this.form.get('people_id')?.setValue(person.id);
  }


  filterPeople(event: any) {
    const query = event.query;
    this.searchSubject.next(query);
    
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  closeModal(): void {
    this.ref.close();
  }

  


  onSubmit(){
    this._loadingService.onDisplayLoading();
    this._affirmationService.addParticipants(this.form.value)
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
          detail: `Participante agregado correctamente.`,
        });
        this.ref.close(true);
      },
      error: (err: HttpErrorResponse) => {
        this._toastService.show({
          severity: 'error',
          summary: 'Error',
          detail: typeof err.error === 'string'
            ? err.error
            : err.error.message || 'Ha ocurrido un error inesperado.',
        });
      },
    });
  }

}
