import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GroupsService } from '../../person/services/groups.service';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { Groups } from '../../../core/interfaces/groups.interface';

@Component({
  selector: 'app-groups-dropdown-form-field',
  imports: [CommonModule, ReactiveFormsModule, DropdownModule],
  templateUrl: './groups-dropdown-form-field.component.html',
  styleUrl: './groups-dropdown-form-field.component.scss'
})
export class GroupsDropdownFormFieldComponent {

  @Input({ required: true }) control: FormControl = new FormControl();
  @Input() label: string = '';
  @Input() inputId: string = '';
  @Input() placeholder: string = '';
  @Input() networkId: string | null = null;

  public groups: Groups[] = [];

  constructor(private _groupService: GroupsService) { }

  ngOnChanges() {
  if (this.networkId) {
      this._groupService.getAllGroups(this.networkId).subscribe({
        next: (groups) => {
          this.groups = groups.map(group => {
            const leader = group.leadersGroup?.[0]?.person;
            const leaderName = leader ? `${leader.names} ${leader.surname}`.trim() : '';
            return {
              ...group,
              label: leaderName ? `${group.name} - ${leaderName}` : group.name,
            };
          });
        }
      });
    }
  }

  



}
