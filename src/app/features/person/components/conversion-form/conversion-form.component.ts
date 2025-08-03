import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { Subscription } from 'rxjs';
import { PersoService } from '../../../../core/services/person.service';
import { SvgIconPipe } from '../../../../core/pipes/svg-icon.pipe';
import { CommonModule } from '@angular/common';
import { CreateConversionFormComponent } from '../create-conversion-form/create-conversion-form.component';
import { ManageConversionTableComponent } from '../manage-conversion-table/manage-conversion-table.component';

@Component({
  selector: 'app-conversion-form',
  imports: [CommonModule, CardModule, SvgIconPipe, CreateConversionFormComponent, ManageConversionTableComponent],
  templateUrl: './conversion-form.component.html',
  styleUrl: './conversion-form.component.scss'
})
export class ConversionFormComponent {

  public personSubs!: Subscription;
  public personId: string = '';
  public textHeader: string = '';

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _personService: PersoService,
  ) { }

  ngOnInit() {
    this.personSubs = this._personService.person$.subscribe({
      next: (person) => {
        this.personId = person.id;
        this.textHeader = `En esta sección se  registran los datos relacionados con la conversión de ${person.names} ${person.surname}. Esto incluye información sobre la primera vez que aceptó a Jesús como su señor y salvador y si ha realizado actos de reconciliación en más de una ocasión.`;
      },
    });
  }

  onBack() {
    this._router.navigate(['../../create/general-information'], {
      relativeTo: this._activatedRoute,
    });
  }






}
