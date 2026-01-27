import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-label-button',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './label-button.component.html',
    styles: [`
    .label-btn {
      padding: 0 8px;
      border-radius: 6px;
      border-style: solid;
      border-width: 1px;
      cursor: pointer;
      font-weight: bold;
      transition: opacity 0.2s;
      height: 24px;
    }
    .label-btn:hover {
      opacity: 0.8;
    }
  `]
})
export class LabelButtonComponent {
    label = input<string>('Label Btn');
    bgColor = input<string>('#F8F9FB');
    borderColor = input<string>('#0A2F4D22');
    textColor = input<string>('#505A5F');
}