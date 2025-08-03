import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SectionHeaderComponent } from '../../../../core/components/section-header/section-header.component';
import { CardModule } from 'primeng/card';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from '../../../../core/services/loading.service';
import { finalize, forkJoin } from 'rxjs';
import { LeadersService } from '../../services/leaders.service';
import { DetailsGroupsTableComponent } from '../../components/details-groups-table/details-groups-table.component';
import { GroupsService } from '../../../person/services/groups.service';
import { Groups } from '../../../../core/interfaces/groups.interface';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Person } from '../../../../core/interfaces/manage-person.interface';

@Component({
  selector: 'app-detail-group-page',
  imports: [CommonModule, SectionHeaderComponent, CardModule, DetailsGroupsTableComponent, ToggleSwitchModule],
  templateUrl: './detail-group-page.component.html',
  styleUrl: './detail-group-page.component.scss'
})
export class DetailGroupPageComponent {

  public group_id: string = '';
  public leaders: string = '';
  public host: Person;
  public group: Groups;
  public title = 'Detalle de casa de reino';

  constructor(private _activatedRoute: ActivatedRoute,
              private _loadingService: LoadingService,
              private _leadersService: LeadersService,
              private _groupsService: GroupsService
            ) {}
  
    ngOnInit() {
      this._activatedRoute.params
            .subscribe(({ group_id: group_id = ''}) => {
              this.group_id = group_id;
              this.getData(group_id);
      });
    }


    getData(id: string) {
        this._loadingService.onDisplayLoading();
        forkJoin([
          this._leadersService.getOneLeaders(id),
          this._groupsService.getAllPersonGroup(id)
        ])
          .pipe(
            finalize(() => {
              this._loadingService.onHideLoading();
            })
          )
          .subscribe({
            next: ([Leaders, Group]) => {
               if(Leaders)
                 this.leaders = `${ Leaders.person.names } ${ Leaders.person.surname }`;

               this.group = Group;
               if(Group){
                 this.title = `Detalle de casa de reino ${Group.name}`;  //{{ group ? group[0].name : '' }}
                 this.host = Group.person.find((e)=> e.is_host === true);
               }
               
            },
          });
      }



}
