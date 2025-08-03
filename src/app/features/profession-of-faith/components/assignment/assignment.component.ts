import { CommonModule } from '@angular/common';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LoadingService } from '../../../../core/services/loading.service';
import { ToastService } from '../../../../core/services/toast.service';
import { NetworksDropdownFormFieldComponent } from '../../../components/networks-dropdown-form-field/networks-dropdown-form-field.component';
import { GroupsDropdownFormFieldComponent } from '../../../components/groups-dropdown-form-field/groups-dropdown-form-field.component';
import { PersonService } from '../../../person/services/person.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-assignment',
  imports: [ 
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    NetworksDropdownFormFieldComponent,
    GroupsDropdownFormFieldComponent
  ],
  templateUrl: './assignment.component.html',
  styleUrl: './assignment.component.scss'
})
export class AssignmentComponent {
  public form!: FormGroup;
  public selectedNetworkId!: string;
  


  constructor(
    private config: DynamicDialogConfig,
    private _fb: FormBuilder, 
    private _loadingService: LoadingService,
    private _toastService: ToastService,
    public ref: DynamicDialogRef,
    public _PersonService: PersonService
  ) { }


  ngOnInit(): void {
    this.initForm();
  }

  




  initForm() {
    const data = this.config.data;
    console.log(data);
    
    this.form = this._fb.group({
      id_person: [data.id_person, Validators.required],
      group_id: [null, Validators.required],
      network_id: [null, Validators.required],
    });

    this.form.get('network_id')?.valueChanges.subscribe((value) => {
      this.selectedNetworkId = value;
      this.form.get('group_id')?.reset();
    });


  }

  getControl(name: string) {
    return this.form.get(name) as FormControl;
  }


  closeModal(): void {
    this.ref.close();
  }



  onSubmit(){
    this._loadingService.onDisplayLoading();
    this._PersonService.updateGroups(this.form.value)
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
            detail: `Daos actualizados correctamente.`,
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


  





  

  
}
