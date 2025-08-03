import { Component, Input } from '@angular/core';
import { SvgIconPipe } from '../../pipes/svg-icon.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [SvgIconPipe, CommonModule],
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.scss',
})
export class SectionHeaderComponent {
  @Input({ required: true }) titleheader: string = '';
  @Input({ required: true }) description: string = '';
  @Input({ required: true }) image: string = '';
}
