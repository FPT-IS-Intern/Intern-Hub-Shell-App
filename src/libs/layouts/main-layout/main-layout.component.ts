import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from '../../main-components/header/header.component';
import { SidebarComponent } from '../../main-components/sidebar/sidebar.component';
import { ApprovalListComponent } from '../../components/approval-list/approval-list.component';
import { ApprovalListItemInterface } from '../../components/approval-list-item/approval-list-item.model';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    ApprovalListComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
  @ViewChild('textRight', { static: true })
  textRight!: TemplateRef<any>;

  @ViewChild('buttonRight', { static: true })
  buttonRight!: TemplateRef<any>;

  rows: ApprovalListItemInterface[] = [];

  ngOnInit() {
    this.rows = [
      {
        name: 'Đơn hàng #001',
        date: new Date('2025-01-10'),
        rightTemplate: this.textRight,
        rightContext: { $implicit: 'Đang xử lý' },
      },
      {
        name: 'Đơn hàng #002',
        date: new Date('2025-01-11'),
        rightTemplate: this.buttonRight,
        rightContext: {
          onClick: () => this.openDetail(2),
        },
      },
      {
        name: 'Đơn hàng #003',
        date: new Date('2025-01-12'),
        rightTemplate: this.textRight,
        rightContext: { $implicit: 'Hoàn thành' },
      },
    ];
  }

  openDetail(id: number) {
    console.log('Open order detail:', id);
  }
}
