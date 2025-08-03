import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { responseMeetings } from '../../interfaces/meetings.interface';
import { MeetingsService } from '../../services/meetings.service';

@Component({
  selector: 'app-meetings-type-dropdown-form-field',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule
  ],
  templateUrl: './meetings-type-dropdown-form-field.component.html',
  styleUrl: './meetings-type-dropdown-form-field.component.scss'
})
export class MeetingsTypeDropdownFormFieldComponent {
  @Input({ required: true }) control: FormControl = new FormControl();
  @Input() label: string = '';
  @Input() inputId: string = '';
  @Input() placeholder: string = '';

  public dataMeetings: responseMeetings[] = [];

  constructor(private meetingsService: MeetingsService) { }

  ngOnInit() {
    this.meetingsService.getMeetings().subscribe({
      next: (dataMeetings) => (this.dataMeetings = dataMeetings),
    });
  }

  get isRequired() {
    return this.control?.touched && this.control?.hasError('required');
  }




}
