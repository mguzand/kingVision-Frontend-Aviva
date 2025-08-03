import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { StepsModule } from 'primeng/steps';
import { PersoService } from '../../../../core/services/person.service';
import { isUUIDv4 } from '../../../../core/helpers/is-uuid.interface';
import { finalize, forkJoin, Subject, takeUntil } from 'rxjs';
import { LoadingService } from '../../../../core/services/loading.service';

@Component({
  selector: 'app-create-of-edit-peron',
  standalone: true,
  imports: [RouterModule, CardModule, StepsModule],
  templateUrl: './create-of-edit-peron.component.html',
  styleUrl: './create-of-edit-peron.component.scss',
})
export class CreateOfEditPeronComponent {
  public stepsItems: MenuItem[] = [
    {
      label: 'Información General',
      routerLink: 'general-information',
    },
    {
      label: 'Información de conversión',
      routerLink: 'conversion',
    },
  ];

  private _destroy$ = new Subject<void>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _personService: PersoService,
    // private _congregationService: CongregationService,
    private _loadingService: LoadingService
  ) { }

  ngOnInit() {
    // this._activatedRoute.params.subscribe(({ personId: personid = '' }) => {
    //   if (personid && isUUIDv4(personid)) this.getData(personid);
    // });
    this._activatedRoute.params
      .pipe(takeUntil(this._destroy$))
      .subscribe(({ personId: personid = '' }) => {
        if (personid && isUUIDv4(personid)) this.getData(personid);
      });


  }

  getData(id: string) {
    this._loadingService.onDisplayLoading();
    forkJoin([this._personService.getPersonById(id)])
      .pipe(
        finalize(() => {
          this._loadingService.onHideLoading();
        })
      )
      .subscribe({
        next: ([PerfilPerson]) => {
          const { person } = PerfilPerson;
          this._personService.person$.next(person);
        },
      });
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
    this._personService.person$.next({
      id: '',
      identity: '',
      names: '',
      surname: '',
      birth_date: '',
      gender: '',
      marital_status: '',
      email: '',
      network_id: '',
      group_id: '',
      address: '',
      phone: ''
    });
  }


}
