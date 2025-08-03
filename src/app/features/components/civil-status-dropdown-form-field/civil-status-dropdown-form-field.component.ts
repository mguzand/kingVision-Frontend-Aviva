import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-civil-status-dropdown-form-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DropdownModule],
  templateUrl: './civil-status-dropdown-form-field.component.html',
  styleUrl: './civil-status-dropdown-form-field.component.scss',
})
export class CivilStatusDropdownFormFieldComponent {
  @Input({ required: true }) control: FormControl = new FormControl();
  @Input() label: string = '';
  @Input() inputId: string = '';
  @Input() placeholder: string = '';

  public civilStatus: any[] = [];

  get isRequired() {
    return this.control?.touched && this.control?.hasError('required');
  }

  constructor() {}

  ngOnInit() {
    this.civilStatus = [
      { estado_civil: 'Casado(a)' },
      { estado_civil: 'Soltero(a)' },
      { estado_civil: 'Union Libre' },
      { estado_civil: 'Viudo(a)' },
    ];
  }
}
