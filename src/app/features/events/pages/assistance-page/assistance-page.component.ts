import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { AssistanceComponent } from '../../components/assistance/assistance.component';

@Component({
  selector: 'app-assistance-page',
  imports: [
    CardModule,
    AssistanceComponent
  ],
  templateUrl: './assistance-page.component.html',
  styleUrl: './assistance-page.component.scss'
})
export class AssistancePageComponent {

}
