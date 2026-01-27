import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-approval-list-item',
  templateUrl: './approval-list-item.component.html',
  styleUrls: ['./approval-list-item.component.scss'],
  imports: [CommonModule],
  standalone: true
})
export class ApprovalListItemComponent {
  @Input() name!: string;
  @Input() date!: Date;
  @Input() rightTemplate?: TemplateRef<any>;
  @Input() rightContext: any = {};

  get parsedDate(): Date {
    return new Date(this.date);
  }
}
