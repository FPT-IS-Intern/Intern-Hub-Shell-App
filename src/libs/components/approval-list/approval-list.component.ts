import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApprovalListItemComponent } from "../approval-list-item/approval-list-item.component";
import { ApprovalListItemInterface } from '../approval-list-item/approval-list-item.model';

@Component({
  selector: 'app-approval-list',
  standalone: true,
  imports: [CommonModule, ApprovalListItemComponent],
  templateUrl: './approval-list.component.html',
  styleUrls: ['./approval-list.component.scss'],
})
export class ApprovalListComponent {
  @Input() rows: ApprovalListItemInterface[] = [];

  @Input() headerContentRight!: string;
  @Input() headerContentLeft!: string;
}
