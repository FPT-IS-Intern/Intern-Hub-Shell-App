import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from '../../main-components/header/header.component';
import { SidebarComponent } from '../../main-components/sidebar/sidebar.component';
import { ApprovalListItemInterface } from '../../components/approval-list-item/approval-list-item.model';
import { ApprovalListComponent } from '../../components/approval-list/approval-list.component';
import { ButtonContainerComponent } from '../../main-components/button-container/button-container.component';
import { PopUpConfirmComponent } from '../../main-components/pop-up-confirm/pop-up-confirm.component';

@Component({
  selector: 'app-main-layout-test',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ButtonContainerComponent,
    HeaderComponent,
    SidebarComponent,
    PopUpConfirmComponent,
    ApprovalListComponent,
  ],
  templateUrl: './main-layout-test.component.html',
  styleUrls: ['./main-layout-test.component.scss'],
})
export class MainLayoutTestComponent {
  @ViewChild('textRight', { static: true })
  textRight!: TemplateRef<any>;

  @ViewChild('buttonRight', { static: true })
  buttonRight!: TemplateRef<any>;

  // Sample data for approval list
  approvalRows: ApprovalListItemInterface[] = [
    { name: 'Nguyễn Văn A', date: new Date('2026-01-15') },
    { name: 'Trần Thị B', date: new Date('2026-01-20') },
    { name: 'Lê Văn C', date: new Date('2026-01-25') },
    { name: 'Phạm Thị D', date: new Date('2026-01-28') },
  ];

  showPopup = false;

  onButtonClick(buttonName: string): void {
    console.log(`Button clicked: ${buttonName}`);
    this.showPopup = true;
  }

  onPopupConfirm(): void {
    console.log('✅ Popup confirmed!');
    this.showPopup = false;
  }

  onPopupCancel(): void {
    console.log('❌ Popup cancelled!');
    this.showPopup = false;
  }
}
