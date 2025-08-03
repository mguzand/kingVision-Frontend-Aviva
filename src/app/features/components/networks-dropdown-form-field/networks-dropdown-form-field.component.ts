import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Networks } from '../../person/interfaces/network.interface';
import { NetworksService } from '../../networks/services/networks.service';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-networks-dropdown-form-field',
  imports: [CommonModule, ReactiveFormsModule, DropdownModule],
  templateUrl: './networks-dropdown-form-field.component.html',
  styleUrl: './networks-dropdown-form-field.component.scss'
})
export class NetworksDropdownFormFieldComponent {
  @Input({ required: true }) control: FormControl = new FormControl();
  @Input() label: string = '';
  @Input() inputId: string = '';
  @Input() placeholder: string = '';

  public networks: Networks[] = [];

  constructor(private _networksService: NetworksService) { }

  get isRequired() {
    return this.control?.touched && this.control?.hasError('required');
  }


  ngOnInit() {
    this._networksService.getAllNetworks().subscribe({
      next: (networks) => (this.networks = networks),
    });
  }



}
