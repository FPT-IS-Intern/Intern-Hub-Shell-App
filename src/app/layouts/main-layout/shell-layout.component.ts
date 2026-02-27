import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent, HeaderData } from '../../components/header/header.component';
import { SidebarComponent, SidebarData } from '../../components/sidebar/sidebar.component';
import { IconData } from '@goat-bravos/intern-hub-layout';
import { AuthService } from '../../services/auth.service';
import { StorageUtil } from '../../utils/storage.util';

@Component({
  selector: 'app-shell-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './shell-layout.component.html',
  styleUrls: ['./shell-layout.component.scss'],
})
export class ShellLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Mobile sidebar state
  isMobileSidebarOpen = false;

  // Desktop sidebar state
  isSidebarExpanded = false;

  headerData: HeaderData = {
    logo: 'https://s3.vn-hcm-1.vietnix.cloud/bravos/uploads/a6e2169c-ca10-4b05-ba05-1ec636734f9a.svg',
    headerItems: [
      {
        icon: 'dsi-notification-text-line',
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
    ],
    userMenuData: {
      userName: 'Nguyễn Văn An',
      userEmail: 'an.nv@fpt.com',
      userRole: 'Fullstack Developer',
      userIcon: 'dsi-user-01-line',
      userIconColor: 'var(--brand-500)',
      dropdownIcon: 'dsi-arrow-down-solid',
      dropdownIconColor: 'var(--brand-500)',
      userMenuItems: [
        {
          icon: 'dsi-user-01-line',
          content: 'Thông tin cá nhân',
          method: () => console.log('Profile clicked'),
        },
        {
          icon: 'dsi-settings-line',
          content: 'Cài đặt',
          method: () => this.handleSettings(),
        },
        {
          icon: 'dsi-logout-01-line',
          content: 'Đăng xuất',
          method: () => this.handleLogout(),
        },
      ],
    },
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
        iconLeft: 'dsi-arrow-circle-broken-up-line',
        content: 'Lộ Trình Đào tạo',
        iconRight: 'dsi-arrow-circle-up-line',
        children: [
          {
            iconLeft: 'dsi-user-01-lino',
            content: 'Bài Học',
            url: '/lms',
          },
        ],
      },

      {
        iconLeft: 'dsi-user-01-line',
        content: 'Quản Lí Dự Án',
        url: '/projects',
      },
      {
        iconLeft: 'dsi-briefcase-line',
        content: 'Tạo Phiếu',
        url: '/tickets',
      },
      {
        iconLeft: 'dsi-mail-01-line',
        content: 'Hòm Thư Góp Ý',
        url: '/feedback',
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

  handleLogout(): void {
    const accessToken = StorageUtil.getAccessToken();
    const refreshToken = StorageUtil.getRefreshToken();

    if (accessToken && refreshToken) {
      this.authService
        .logout({
          accessToken,
          refreshToken,
        })
        .subscribe({
          next: () => {
            console.log('🚪 Logged out successfully');
            this.router.navigate(['/auth']);
          },
          error: (err) => {
            console.error('❌ Logout failed:', err);
            // Vẫn thực hiện xóa local và chuyển trang nếu có lỗi API để đảm bảo người dùng thoát được
            StorageUtil.clearAll();
            this.router.navigate(['/auth']);
          },
        });
    } else {
      StorageUtil.clearAll();
      this.router.navigate(['/auth']);
    }
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
