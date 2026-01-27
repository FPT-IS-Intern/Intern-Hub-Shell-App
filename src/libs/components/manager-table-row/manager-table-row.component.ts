import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'table-row',
  templateUrl: './manager-table-row.component.html',
  styleUrls: ['./manager-table-row.component.scss'],
  imports: [CommonModule],
  standalone: true
})
export class ManagerTableRowComponent {
  @Input() name!: string;
  @Input() date!: Date;
  @Input() rightTemplate?: TemplateRef<any>;
  @Input() rightContext: any = {};

  get parsedDate(): Date {
    return new Date(this.date);
  }
}
