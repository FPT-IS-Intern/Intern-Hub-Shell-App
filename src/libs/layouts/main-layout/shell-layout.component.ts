import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {
  HeaderComponent,
  IconData,
  SidebarComponent,
  SidebarData,
} from '@goat-bravos/intern-hub-layout';

@Component({
  selector: 'app-shell-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './shell-layout.component.html',
  styleUrls: ['./shell-layout.component.scss'],
})
export class ShellLayoutComponent {
  // Mobile sidebar state
  isMobileSidebarOpen = false;

  // Desktop sidebar state
  isSidebarExpanded = false;

  headerData = {
    logo: 'https://s3.vn-hcm-1.vietnix.cloud/bravos/uploads/a6e2169c-ca10-4b05-ba05-1ec636734f9a.svg',
    userName: 'Nguyễn Văn An',
    userIcon: 'dsi-user-01-line',
    userIconColor: 'var(--brand-500)',
    dropdownIcon: 'dsi-arrow-down-solid',
    dropdownIconColor: 'var(--brand-500)',
    minWidth: '1366px',

    headerItems: [
      {
        icon: 'dsi-home-01-line',
        content: 'Search',
        colorIcon: 'var(--brand-700)',
        width: '16px',
        height: '16px',
        method: () => this.handleSearch(),
      },
      {
        icon: 'dsi-message-notification-circle-line',
        content: 'Notifications',
        colorIcon: 'var(--brand-700)',
        width: '16px',
        height: '16px',
        method: () => this.handleNotifications(),
      },
      {
        icon: 'dsi-mail-01-line',
        content: 'Messages',
        colorIcon: 'var(--brand-700)',
        width: '16px',
        height: '16px',
        method: () => this.handleMessages(),
      },
      {
        icon: 'dsi-info-circle-line',
        content: 'Help',
        colorIcon: 'var(--brand-700)',
        width: '16px',
        height: '16px',
        method: () => this.handleHelp(),
      },
    ],
  };

  sidebarData: SidebarData = {
    backgroundColor: 'var(--brand-500)',
    collapseIcon: 'dsi-arrow-left-line',
    expandIcon: 'dsi-arrow-right-line',
    toggleButtonBackgroundColor: 'var(--brand-600)',
    closeButtonBackgroundColor: 'var(--neutral-color-50)',
    toggleButtonIconColor: 'var(--neutral-alpha-white)',
    toggleButtonWidth: '32px',
    toggleButtonHeight: '32px',
    toggleButtonSize: 'sm',
    closeButtonMarginRight: '12px',

    menuItems: [
      {
        iconLeft: 'dsi-home-01-line',
        content: 'Trang Chủ',
        url: '/homePage',
        colorIconLeft: 'var(--neutral-color-100)',
        colorIconLeftHover: 'var(--brand-500)',
        colorContent: 'var(--neutral-color-400)',
        colorContentHover: 'var(--neutral-color-100)',
        backgroundColorHover: 'var(--neutral-color-900)',
        borderRadius: '8px',
        width: '100%',
        height: '48px',
      },
      {
        iconLeft: 'dsi-user-01-line',
        content: 'Khóa Học',
        url: '/lms',
        colorIconLeft: 'var(--neutral-color-100)',
        colorIconLeftHover: 'var(--brand-500)',
        colorContent: 'var(--neutral-color-400)',
        colorContentHover: 'var(--brand-500)',
        backgroundColorHover: 'var(--neutral-100)',
        borderRadius: '8px',
        width: '100%',
        height: '48px',
      },
      {
        iconLeft: 'dsi-briefcase-line',
        content: 'Error',
        url: '/error',
        colorIconLeft: 'var(--neutral-color-100)',
        colorIconLeftHover: 'var(--brand-500)',
        colorContent: 'var(--neutral-color-400)',
        colorContentHover: 'var(--brand-500)',
        backgroundColorHover: 'var(--neutral-100)',
        borderRadius: '8px',
        width: '100%',
        height: '48px',
      },
      {
        iconLeft: 'dsi-calendar-line',
        content: 'Lịch làm việc',
        url: '/calendar',
        colorIconLeft: 'var(--neutral-color-100)',
        colorIconLeftHover: 'var(--brand-500)',
        colorContent: 'var(--neutral-color-400)',
        colorContentHover: 'var(--brand-500)',
        backgroundColorHover: 'var(--neutral-100)',
        borderRadius: '8px',
        width: '100%',
        height: '48px',
      },
      {
        iconLeft: 'dsi-chart-line',
        content: 'Thống kê',
        url: '/statistics',
        colorIconLeft: 'var(--neutral-color-100)',
        colorIconLeftHover: 'var(--brand-500)',
        colorContent: 'var(--neutral-color-400)',
        colorContentHover: 'var(--brand-500)',
        backgroundColorHover: 'var(--neutral-100)',
        borderRadius: '8px',
        width: '100%',
        height: '48px',
      },
      {
        iconLeft: 'dsi-team-line',
        content: 'Nhóm',
        url: '/teams',
        colorIconLeft: 'var(--neutral-color-100)',
        colorIconLeftHover: 'var(--brand-500)',
        colorContent: 'var(--neutral-color-400)',
        colorContentHover: 'var(--brand-500)',
        backgroundColorHover: 'var(--neutral-100)',
        borderRadius: '8px',
        width: '100%',
        height: '48px',
      },
    ],
  };

  // Data bổ sung truyền vào Input lẻ của SidebarComponent
  toggleButtonIconConfig: IconData[] = [
    {
      icon: 'dsi-arrow-right-line',
      colorIcon: 'var(--neutral-color-100)',
      width: '16px',
      height: '16px',
    },
  ];

  closeButtonIconConfig: IconData[] = [
    {
      icon: 'dsi-arrow-left-line',
      colorIcon: 'var(--neutral-color-700)',
      width: '16px',
      height: '16px',
    },
  ];
  // Header Action Handlers
  handleSearch(): void {
    console.log('🔍 Search clicked');
  }

  handleNotifications(): void {
    console.log('🔔 Notifications clicked');
  }

  handleMessages(): void {
    console.log('💬 Messages clicked');
  }

  handleHelp(): void {
    console.log('❓ Help clicked');
  }

  handleSettings(): void {
    console.log('⚙️ Settings clicked');
  }

  // Sidebar Toggle Handler
  onSidebarToggle(expanded: boolean): void {
    this.isSidebarExpanded = expanded;
    console.log('Sidebar expanded:', expanded);
  }

  // Mobile Sidebar Toggle
  toggleMobileSidebar(): void {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }

  closeMobileSidebar(): void {
    this.isMobileSidebarOpen = false;
  }
}
