import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-label-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './label-button.component.html',
  styleUrls: ['./label-button.component.scss']
})
export class LabelButtonComponent {
  label = input<string>('Label Btn');
  bgColor = input<string>('#F8F9FB');
  borderColor = input<string>('#0A2F4D22');
  textColor = input<string>('#505A5F');
}