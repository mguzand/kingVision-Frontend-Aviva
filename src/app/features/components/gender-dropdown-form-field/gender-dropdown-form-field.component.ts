import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-gender-dropdown-form-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DropdownModule],
  templateUrl: './gender-dropdown-form-field.component.html',
  styleUrl: './gender-dropdown-form-field.component.scss',
})
export class GenderDropdownFormFieldComponent {
  @Input({ required: true }) control: FormControl = new FormControl();
  @Input() label: string = '';
  @Input() inputId: string = '';
  @Input() placeholder: string = '';

  public gender: any[] = [];

  get isRequired() {
    return this.control?.touched && this.control?.hasError('required');
  }

  constructor() { }

  ngOnInit() {
    this.gender = [
      { genero: 'Masculino' },
      { genero: 'Femenino' }
    ];
  }
}
