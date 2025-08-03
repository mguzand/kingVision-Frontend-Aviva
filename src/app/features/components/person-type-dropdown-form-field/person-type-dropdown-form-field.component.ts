import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-person-type-dropdown-form-field',
  imports: [CommonModule, ReactiveFormsModule, DropdownModule],
  templateUrl: './person-type-dropdown-form-field.component.html',
  styleUrl: './person-type-dropdown-form-field.component.scss'
})
export class PersonTypeDropdownFormFieldComponent {
  @Input({ required: true }) control: FormControl = new FormControl();
  @Input() label: string = '';
  @Input() inputId: string = '';
  @Input() placeholder: string = '';

  public person_type: any[] = [];

  get isRequired() {
    return this.control?.touched && this.control?.hasError('required');
  }

  constructor() {}

  ngOnInit() {
    this.person_type = [
      { estado_civil: 'Nuevo Creyente' },
      { estado_civil: 'Miembro' },
      { estado_civil: 'Discipulo' },
      { estado_civil: 'Lider' },
      { estado_civil: 'Supervisor' },
      { estado_civil: 'Ministro' },
      { estado_civil: 'Anciano' },
      { estado_civil: 'Pastor' },
      { estado_civil: 'Empresario' },
    ];
  }
}
