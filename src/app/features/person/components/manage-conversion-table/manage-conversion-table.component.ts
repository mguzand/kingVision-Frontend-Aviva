import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { conversionResponse } from '../../interfaces/conversion.interface';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { finalize, Subscription } from 'rxjs';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { responseMeetings } from '../../interfaces/meetings.interface';
import { MeetingsService } from '../../services/meetings.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ConversionService } from '../../services/conversion.service';
import { Message } from 'primeng/message';

@Component({
  selector: 'app-manage-conversion-table',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    MenuModule,
    ConfirmDialogModule,
    MessageModule,
    Message
  ],
  templateUrl: './manage-conversion-table.component.html',
  styleUrl: './manage-conversion-table.component.scss'
})
export class ManageConversionTableComponent {
  @Input({ required: true }) personId!: string;
  public isLoading: boolean = false;
  public conversion: conversionResponse[] = [];
  public menuItems: { [key: string]: MenuItem[] } = {};
  public conversionSubs!: Subscription;
  public dialogRef!: DynamicDialogRef;
  public dataMeetings: responseMeetings[] = [];

  constructor(
    private conversionService: ConversionService,
    private meetingsService: MeetingsService,
    private _confirmationService: ConfirmationService,
    private _toastService: ToastService
  ) { }


  async ngOnInit() {
    this.meetingsService.getMeetings().subscribe({
      next: (dataMeetings) => {
        this.dataMeetings = dataMeetings;
        this.getData();
      },
    });

    this.conversionSubs = this.conversionService.conversion$.subscribe(
      (_conversion) => {
        if (_conversion.id.length > 0) this.addConversionfit(_conversion);
      }
    );

  }

  getData() {
    this.isLoading = true;
    this.conversionService
      .getConversionById(this.personId)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (conversion) => {
          this.conversion = conversion;
          this.mapData();
        },
      });
  }



  addConversionfit(conversion: conversionResponse) {
    let existConversion = this.conversion.find((a) => a.id === conversion.id);
    if (!existConversion && conversion.id.length) {
      this.conversion.push(conversion);
      this.mapData();
    } else if (existConversion) {
      existConversion.date_conversion = conversion.date_conversion;
    }
  }


  mapData() {
    this.menuItems = {};
    for (let studies of this.conversion)
      this.menuItems[studies.id] = [
        {
          label: 'Editar',
          icon: 'pi pi-pencil',
          //command: () => this.showUpdateDialog(studies),
        },
        {
          label: 'Eliminar',
          icon: 'pi pi-trash',
          iconClass: 'text-red-500',
          //command: () => this.onDeleteActivity(studies.id),
        },
      ];
  }

  getMeeting(tipo_reunion: string) {
    return this.dataMeetings.find((e) => e.id === tipo_reunion).name_meeting;
  }








}
