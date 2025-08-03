import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Person } from '../../../../core/interfaces/manage-person.interface';
import { RnpPerson } from '../../../person/interfaces/person-status.interface';
import { ToastService } from '../../../../core/services/toast.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { PersoService } from '../../../../core/services/person.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SvgIconPipe } from '../../../../core/pipes/svg-icon.pipe';
import { CommonModule } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker';
import { CivilStatusDropdownFormFieldComponent } from '../../../components/civil-status-dropdown-form-field/civil-status-dropdown-form-field.component';
import { GenderDropdownFormFieldComponent } from '../../../components/gender-dropdown-form-field/gender-dropdown-form-field.component';
import { NetworksDropdownFormFieldComponent } from '../../../components/networks-dropdown-form-field/networks-dropdown-form-field.component';
import { EditorModule } from 'primeng/editor';
import { GroupsDropdownFormFieldComponent } from '../../../components/groups-dropdown-form-field/groups-dropdown-form-field.component';
import { InputMaskModule } from 'primeng/inputmask';
import { PersonTypeDropdownFormFieldComponent } from '../../../components/person-type-dropdown-form-field/person-type-dropdown-form-field.component';
import { DropdownModule } from 'primeng/dropdown';
import { MeetingsTypeDropdownFormFieldComponent } from '../../../person/components/meetings-type-dropdown-form-field/meetings-type-dropdown-form-field.component';
import { AutoComplete } from 'primeng/autocomplete';
import { catchError, debounceTime, finalize, of, Subject, Subscription, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-forms',
  imports: [
    CardModule,
    DropdownModule,
    InputTextModule,
    SvgIconPipe,
    CommonModule,
    ReactiveFormsModule,
    DatePickerModule,
    CivilStatusDropdownFormFieldComponent,
    GenderDropdownFormFieldComponent,
    NetworksDropdownFormFieldComponent,
    EditorModule,
    GroupsDropdownFormFieldComponent,
    InputMaskModule,
    PersonTypeDropdownFormFieldComponent,
    MeetingsTypeDropdownFormFieldComponent,
    AutoComplete
    
  ],
  templateUrl: './create-forms.component.html',
  styleUrl: './create-forms.component.scss'
})
export class CreateFormsComponent {
  public createMemberForm!: FormGroup;
  public person!: Person;
  filteredPeople: Person[] = [];
  es: any;
  image: string = '';
  dataRnp: RnpPerson; 
  public selectedNetworkId!: string;
  public typeConversion = [
    { value: 1, name: 'Acepto por primera vez' },
    { value: 2, name: 'Reconcilio con Jesús' },
  ];
  private searchSubject = new Subject<string>();
  private subscription: Subscription;

  constructor(
    private _fb: FormBuilder,
    private _toastService: ToastService,
    private _loadingService: LoadingService,
    private _personService: PersoService,
    
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) { }


  async ngOnInit() {
    this.initForm();
  }

  onSearchUserByDni() {
      const pattern = new RegExp('^([0-9]){13,13}$');
      let identity: string = this.createMemberForm?.get('identity')?.value;
      if (pattern.test(identity)) {
        this._loadingService.onDisplayLoading();
        this._personService.verifyStatus(identity)
          .pipe(
            finalize(() => {
              this._loadingService.onHideLoading();
            })
          )
          .subscribe({
            next: (res) => {
              const { person, rnp, InternalRNP } = res;
              this.dataRnp = rnp;
              
              if (res.person) {
                this._toastService.show({
                  severity: 'warn',
                  summary: 'Número de identidad ya registrado',
                  detail:
                    'Se obtienen datos por una posible actualización de la persona.',
                });

                 this._router.navigate(['../../', 'person', person.id, 'conversion'], {
                  relativeTo: this._activatedRoute,
                 });

              }else if(rnp){
                 
                 const fordara = {
                        names: rnp?.Nombres,
                        surname:  `${rnp?.PrimerApellido} ${rnp?.SegundoApellido}`,
                        birth_date: new Date(rnp?.FechaDeNacimiento),
                        gender: rnp.Sexo === 'M' ? 'Masculino' : 'Femenino',
                        marital_status: this.titleCase(rnp?.DescrEstadoCivil),
                }
                this.createMemberForm.patchValue({
                  ...fordara,
                }); 
                if (rnp.Foto) this.image = `data:image/jpeg;base64,${rnp.Foto}`;
              }else if(InternalRNP){
                const fordara = {
                  names: `${ InternalRNP.primerNombre.trim() } ${ InternalRNP.segundoNombre  !== 'null' ? InternalRNP.segundoNombre.trim() : null }`,
                  surname:  `${ InternalRNP.primerApellido } ${ InternalRNP.segundoApellido  !== 'null' ? InternalRNP.segundoApellido : null }`,
                  birth_date: new Date(InternalRNP?.fechaNacimiento),
                  gender: InternalRNP.codigoSexo === 1 ? 'Masculino' : 'Femenino',
                }
                this.createMemberForm.patchValue({
                  ...fordara,
                }); 
              }
            }
          })
      }
    }

  titleCase(value: string): string {
    return value
      .toLowerCase()
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  onSubmit(){
    if (this.createMemberForm.invalid) {
      this._toastService.show({
          severity: 'error',
          summary: `Formulario inválido`,
          detail: `Por favor, completa todos los campos requeridos correctamente.`,
      });
      return;
    }

    this._loadingService.onDisplayLoading()
    this._personService.createPersonProffesion({...this.createMemberForm.value, base64FileFoto: this.image}).subscribe({
      next: () => {
        this._loadingService.onHideLoading();
        this._toastService.show({
          severity: 'error',
          summary: `Miembro creado exitosamente`,
          detail: `El miembro ha sido creado correctamente.`,
        });  
        this.image = '';
        this.createMemberForm.reset();
        this.createMemberForm.patchValue({
          date_conversion: new Date(),
          person_type: 'Nuevo Creyente' ,
        });
      },
        error: (error: HttpErrorResponse) => {
          const detail =
            error.status === 0
              ? 'No se puede realizar la conexión al servidor'
              : error.error?.message || error.message;
        },
    });
  }


  // Funcion para inicializar el formulario
  initForm() {
    this.createMemberForm = this._fb.group({
      identity: ['', [this.optionalExactLength(13)]],
      names: ['', [Validators.required, Validators.maxLength(70), Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.maxLength(70), Validators.minLength(2)]],
      birth_date: ['', Validators.required],
      gender: ['', Validators.required],
      marital_status: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.email]],
      network_id: [''],
      group_id: [''],
      address: [''],
      person_type: ['Nuevo Creyente' ],

      date_conversion: [new Date(), Validators.required],
      conversion_type: [null, Validators.required],
      network_type: [null, Validators.required],
      invited_by: [''],
      prayer_request: [''],
    });

    this.createMemberForm.get('network_id')?.valueChanges.subscribe((value) => {
      this.selectedNetworkId = value;
      this.createMemberForm.get('group_id')?.reset();
    });

    this.subscription = this.searchSubject.pipe(
      debounceTime(400),
      switchMap(query =>
        this._personService.searchPeople(query).pipe(
          catchError(() => of([]))
        )
      )
    ).subscribe(results => {
      this.filteredPeople = results;
    });



  }

    optionalExactLength(length: number) {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;

        // Permitir vacío
        if (!value) {
          return null;
        }

        // Si no está vacío, debe tener exactamente `length` caracteres
        return value.length === length ? null : { exactLength: { requiredLength: length, actualLength: value.length } };
      };
   }



  filterPeople(event: any) {
    const query = event.query;
    this.searchSubject.next(query);
    
  }

  getControl(name: string) {
    return this.createMemberForm.get(name) as FormControl;
  }

  getFullName = (person: any): string => {
    return `${person.names} ${person.surname}`;
  };


  //➔➔➔➔➔➔➔Validar Identidad
  get isNotValidIdentity() {
    return (
      this.createMemberForm?.get('identity')?.touched &&
      this.createMemberForm.get('identity')?.hasError('exactLength')
    );
  }

  //➔➔➔➔➔➔➔Validar Nombres
  get isNotValidName() {
    return (
      this.createMemberForm?.get('names')?.touched &&
      this.createMemberForm.get('names')?.hasError('required')
    );
  }

  //➔➔➔➔➔➔➔Validar Apellidos
  get isNotValidSurnames() {
    return (
      this.createMemberForm?.get('surname')?.touched &&
      this.createMemberForm.get('surname')?.hasError('required')
    );
  }

  //➔➔➔➔➔➔➔Validar Fecha Nacimiento
  get isRequiredDate() {
    return (
      this.createMemberForm.get('birth_date')?.touched &&
      this.createMemberForm.get('birth_date')?.hasError('required')
    );
  }

  //Validar formato de correo
  get isNotValidEmailFormat() {
    return (
      this.createMemberForm?.get('email')?.touched &&
      this.createMemberForm.get('email')?.hasError('email')
    );
  }

  get isNotValidPhoneFormat() {
    return (
      this.createMemberForm?.get('phone')?.touched &&
      this.createMemberForm.get('phone')?.hasError('required')
    );
  }

  get isRequiredDateConversion() {
    return (
      this.createMemberForm.get('date_conversion')?.touched &&
      this.createMemberForm.get('date_conversion')?.hasError('required')
    );
  }

  get isRequiredConvertion() {
    return (
      this.createMemberForm.get('conversion_type')?.touched &&
      this.createMemberForm.get('conversion_type')?.hasError('required')
    );
  }

  






}
