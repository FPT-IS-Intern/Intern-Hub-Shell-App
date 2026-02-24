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
    // ===== Layout =====
    backgroundColor: 'var(--neutral-color-50)',
    collapseIcon: 'dsi-arrow-left-line',
    expandIcon: 'dsi-arrow-right-line',

    toggleButtonBackgroundColor: 'var(--brand-600)',
    toggleButtonIconColor: 'var(--neutral-alpha-white)',
    toggleButtonWidth: '32px',
    toggleButtonHeight: '32px',
    toggleButtonSize: 'sm',

    closeButtonBackgroundColor: 'var(--neutral-color-50)',
    closeButtonMarginRight: '12px',

    // ===== DEFAULT (collapsed & expanded dùng chung) =====
    defaultWidth: '100%',
    defaultHeight: '48px',
    defaultBorderRadius: '8px',

    defaultColorIconLeft: 'var(--neutral-color-10)',
    defaultColorContent: 'var(--neutral-color-600)',
    defaultBackgroundColor: 'transparent',

    // ===== HOVER =====
    defaultColorIconLeftHover: 'var(--brand-600)',
    defaultColorContentHover: 'var(--brand-600)',
    defaultBackgroundColorHover: 'var(--brand-50)',

    // ===== ACTIVE =====
    activeColorIconLeft: 'var(--brand-500)',
    activeColorContent: 'var(--brand-500)',
    activeBackgroundColor: 'var(--brand-200)',

    // ===== DISABLED =====
    disabledColorIconLeft: 'var(--neutral-color-300)',
    disabledColorContent: 'var(--neutral-color-300)',
    disabledBackgroundColor: 'transparent',

    // ===== EXPANDED MODE OVERRIDE (optional) =====
    defaultColorIconLeftExpanded: 'var(--neutral-color-400)',
    defaultColorIconRightExpanded: 'var(--neutral-color-400)',
    defaultColorContentExpanded: 'var(--neutral-color-400)',
    defaultBackgroundColorExpanded: 'transparent',
    defaultBackgroundColorHoverExpanded: 'var(--neutral-color-100)',

    // =========================
    // Menu Items
    // =========================
    menuItems: [
      {
        iconLeft: 'dsi-home-01-line',
        content: 'Trang Chủ',
        url: '/homePage',
      },
      {
        iconLeft: 'dsi-home-01-line',
        content: 'Button',
        url: '/button',
      },
      {
        iconLeft: 'dsi-user-01-line',
        content: 'Khóa Học',
        url: '/lms',
      },
      {
        iconLeft: 'dsi-briefcase-line',
        content: 'Dự án',
        url: '/projects',
      },
      {
        iconLeft: 'dsi-calendar-line',
        content: 'Lịch làm việc',
        url: '/date-picker',
      },
      {
        iconLeft: 'dsi-chart-line',
        content: 'Input',
        url: '/input',
      },
      {
        iconLeft: 'dsi-arrow-circle-broken-up-line',
        content: 'Nhóm',
        url: '/teams',
        iconRight: 'dsi-arrow-circle-up-line',
        children: [
          {
            iconLeft: 'dsi-user-01-lino',
            content: 'Trang Chủ',
            url: '/homePage',
          },
           {
            iconLeft: 'dsi-user-01-lino',
            content: 'Trang Chủ',
            url: '/homePage',
          },
        ],
      },
      {
        iconLeft: 'dsi-lock-01-line',
        content: 'Disabled item',
        disabled: true,
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
