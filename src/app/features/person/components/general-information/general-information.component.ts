import { ChangeDetectorRef, Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SvgIconPipe } from '../../../../core/pipes/svg-icon.pipe';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Person } from '../../../../core/interfaces/manage-person.interface';
import { PersoService } from '../../../../core/services/person.service';
import { CalendarModule } from 'primeng/calendar';
import { CivilStatusDropdownFormFieldComponent } from '../../../components/civil-status-dropdown-form-field/civil-status-dropdown-form-field.component';
import { GenderDropdownFormFieldComponent } from '../../../components/gender-dropdown-form-field/gender-dropdown-form-field.component';
import { NetworksDropdownFormFieldComponent } from '../../../components/networks-dropdown-form-field/networks-dropdown-form-field.component';
import { EditorModule } from 'primeng/editor';
import { GroupsDropdownFormFieldComponent } from '../../../components/groups-dropdown-form-field/groups-dropdown-form-field.component';
import { finalize, Observer } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../../../core/services/toast.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { DatePickerModule } from 'primeng/datepicker';
import { InputMaskModule } from 'primeng/inputmask';
import { PersonTypeDropdownFormFieldComponent } from '../../../components/person-type-dropdown-form-field/person-type-dropdown-form-field.component';
import { RnpPerson } from '../../interfaces/person-status.interface';

@Component({
  selector: 'app-general-information',
  imports: [
    CardModule,
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
    PersonTypeDropdownFormFieldComponent
  ],
  standalone: true,
  templateUrl: './general-information.component.html',
  styleUrl: './general-information.component.scss'
})
export class GeneralInformationComponent {
  public createMemberForm!: FormGroup;
  public person!: Person;
  public isUpdate: boolean = false;
  public selectedNetworkId!: string;
  es: any;
  image: string = '';
  dataRnp:RnpPerson; 

  constructor(
    private _fb: FormBuilder,
    private _toastService: ToastService,
    private _loadingService: LoadingService,
    private _personService: PersoService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) { }

  ngAfterViewInit() {
    this.cdRef.detectChanges(); // Forza la detección de cambios después de que la vista se haya inicializado
  }


  async ngOnInit() {


    this._personService.person$.subscribe({
      next: (res) => { 
        this.isUpdate = !!res?.id;
        this.person = res;
        this.initForm();
      },
    });

    
  }

  // Funcion para inicializar el formulario
  initForm() {
    this.createMemberForm = this._fb.group({
      identity: [this.person.identity, [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
      names: [this.person.names.toUpperCase(), [Validators.required, Validators.maxLength(70), Validators.minLength(2)]],
      surname: [this.person.surname.toUpperCase(), [Validators.required, Validators.maxLength(70), Validators.minLength(2)]],
      birth_date: [
      this.person.birth_date
        ? new Date(
            +this.person.birth_date.slice(0, 4),
            +this.person.birth_date.slice(5, 7) - 1,
            +this.person.birth_date.slice(8, 10)
          )
        : '',
      Validators.required,
    ],
      gender: [this.person.gender, Validators.required],
      marital_status: [this.person.marital_status, Validators.required],
      phone: [this.person.phone, Validators.required],
      email: [this.person.email, [Validators.email]],
      network_id: [this.person.groups?.network_id || this.person.network_id],
      group_id: [this.person.group_id],
      address: [this.person.address],
      person_type: [this.person.person_type || 'Nuevo Creyente' ],
    });

    this.selectedNetworkId = this.person.groups?.network_id || this.person.network_id;

    this.createMemberForm.get('network_id')?.valueChanges.subscribe((value) => {
      this.selectedNetworkId = value;
      this.createMemberForm.get('group_id')?.reset();
    });
  }


  SearchData(){
    this._loadingService.onDisplayLoading();
    let identity: string = this.createMemberForm?.get('identity')?.value
    this._personService.verifyStatusRnp(identity)
        .pipe(
          finalize(() => {
            this._loadingService.onHideLoading();
          })
    )
    .subscribe({
      next: (rnp) => {
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
        this.dataRnp = rnp;
      }
    })
  }


  onSearchUserByDni() {
    const pattern = new RegExp('^([0-9]){13,13}$');
    let identity: string = this.createMemberForm?.get('identity')?.value;
    if (pattern.test(identity) && !this.isUpdate) {
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
              this.isUpdate = true;
              this._toastService.show({
                severity: 'warn',
                summary: 'Número de identidad ya registrado',
                detail:
                  'Se obtienen datos por una posible actualización de la persona.',
              });
              this.createMemberForm.patchValue({
                ...person,
                network_id: person.groups ? person.groups.network_id : null
              });

              this._personService.person$.next(person);


              setTimeout(() => {
                this.createMemberForm.patchValue({
                  group_id: person.groups ? person.groups.id : null
                });
              }, 100);
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

  getControl(name: string) {
    return this.createMemberForm.get(name) as FormControl;
  }


  //➔➔➔➔➔➔➔Validar Identidad
  get isNotValidIdentity() {
    return (
      this.createMemberForm?.get('identity')?.touched &&
      this.createMemberForm.get('identity')?.hasError('required')
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



  onNext() {
    const summary = `Persona ${this.isUpdate ? 'actualizado' : 'creada'}`;
    const detail = `Persona ${this.isUpdate ? 'actualizado' : 'creada'
      } correctamente.`;

    this._loadingService.onDisplayLoading();
    const payload: Observer<Person> = {
      next: (res) => {
        this.person = res;
        this._personService.person$.next(res);

        this._toastService.show({
          severity: 'success',
          summary,
          detail,
        });
      },
      error: (err: HttpErrorResponse) =>
        this._toastService.show({
          severity: 'error',
          summary: 'Error al crear',
          detail: err.error.message,
        }),
      complete: () =>
        this._router.navigate(['../../', this.person.id, 'conversion'], {
          relativeTo: this._activatedRoute,
        }),
    }

    const observable$ = this.isUpdate
      ? this._personService
        .updateBenefit(this.person.id, {...this.createMemberForm.value, base64FileFoto: this.image})
      : this._personService.createPerson({...this.createMemberForm.value, base64FileFoto: this.image})

    observable$
      .pipe(
        finalize(() => {
          this._loadingService.onHideLoading();
        })
      )
      .subscribe(payload);

  }











}
