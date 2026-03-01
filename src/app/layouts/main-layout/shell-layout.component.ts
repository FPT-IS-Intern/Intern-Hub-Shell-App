import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent, HeaderData } from '../../components/header/header.component';
import { SidebarComponent, SidebarData } from '../../components/sidebar/sidebar.component';
import { IconData } from '@goat-bravos/intern-hub-layout';
import { AuthService } from '../../services/auth.service';
import { StorageUtil } from '@goat-bravos/shared-lib-client';
import { UserService } from '../../services/user.service';
import { SIDEBAR_ICONS } from '../../core/sidebar-icons';

@Component({
  selector: 'app-shell-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './shell-layout.component.html',
  styleUrls: ['./shell-layout.component.scss'],
})
export class ShellLayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  // Mobile sidebar state
  isMobileSidebarOpen = false;

  // Desktop sidebar state
  isSidebarExpanded = false;

  headerData: HeaderData = {
    logo: 'https://s3.vn-hcm-1.vietnix.cloud/bravos/uploads/a6e2169c-ca10-4b05-ba05-1ec636734f9a.svg',
    headerItems: [
      {
        icon: 'custom-icon-search',
        content: 'Tìm kiếm',
        colorIcon: 'var(--brand-700)',
        width: '20px',
        height: '20px',
        method: () => this.handleComingSoon('Tìm kiếm'),
      },
      {
        icon: 'custom-icon-bell',
        content: 'Thông báo',
        colorIcon: 'var(--brand-700)',
        width: '20px',
        height: '20px',
        method: () => this.handleComingSoon('Thông báo'),
      },
      {
        icon: 'custom-icon-mail',
        content: 'Messages',
        colorIcon: 'var(--brand-700)',
        width: '20px',
        height: '20px',
        method: () => this.handleComingSoon('Tin nhắn'),
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
          url: 'hrm/my-profile',
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
    backgroundColor: 'var(--brand-600)',
    collapseIcon: SIDEBAR_ICONS.ARROW_LEFT,
    expandIcon: SIDEBAR_ICONS.ARROW_RIGHT,

    toggleButtonBackgroundColor: 'var(--brand-600)',
    toggleButtonIconColor: 'var(--neutral-color-10)',
    toggleButtonWidth: '32px',
    toggleButtonHeight: '32px',
    toggleButtonSize: 'sm',

    closeButtonBackgroundColor: 'var(--neutral-color-10)',
    closeButtonMarginRight: '12px',

    // ===== DEFAULT (collapsed & expanded dùng chung) =====
    defaultWidth: '100%',
    defaultHeight: '48px',
    defaultBorderRadius: '8px',

    defaultColorIconLeft: 'var(--neutral-color-10)',
    defaultColorContent: 'var(--neutral-color-10)',
    defaultBackgroundColor: 'transparent',

    // ===== HOVER =====
    defaultColorIconLeftHover: 'var(--neutral-color-10)',
    defaultColorContentHover: 'var(--neutral-color-10)',
    defaultBackgroundColorHover: 'var(--brand-500)',

    // ===== ACTIVE =====
    activeColorIconLeft: 'var(--neutral-color-10)',
    activeColorContent: 'var(--neutral-color-10)',
    activeBackgroundColor: 'var(--brand-400)',

    // ===== DISABLED =====
    disabledColorIconLeft: 'var(--neutral-color-300)',
    disabledColorContent: 'var(--neutral-color-300)',
    disabledBackgroundColor: 'transparent',

    // ===== EXPANDED MODE OVERRIDE (optional) =====
    defaultColorIconLeftExpanded: 'var(--neutral-color-10)',
    defaultColorIconRightExpanded: 'var(--neutral-color-50)',
    defaultColorContentExpanded: 'var(--neutral-color-10)',
    defaultBackgroundColorExpanded: 'transparent',
    defaultBackgroundColorHoverExpanded: 'var(--brand-500)',

    // =========================
    // Menu Items
    // =========================
    menuItems: [
      {
        iconLeft: SIDEBAR_ICONS.HOME,
        content: 'Trang chủ',
        url: '/homePage',
      },
      {
        iconLeft: SIDEBAR_ICONS.FEEDBACK,
        content: 'Hòm thư góp ý',
        url: '/feedback',
      },
      {
        iconLeft: SIDEBAR_ICONS.TRAINING,
        content: 'Lộ trình đào tạo',
        url: '/lms',
      },
      {
        iconLeft: SIDEBAR_ICONS.PROJECTS,
        content: 'Dự án',
        url: '/projects',
      },
      {
        iconLeft: SIDEBAR_ICONS.NEWS,
        content: 'Tin tức',
        url: '/news',
      },
    ],
  };

  // Data bổ sung truyền vào Input lẻ của SidebarComponent
  toggleButtonIconConfig: IconData[] = [
    {
      ...SIDEBAR_ICONS.ARROW_RIGHT,
      colorIcon: 'var(--brand-700)',
      width: '14px',
      height: '14px',
    },
  ];

  closeButtonIconConfig: IconData[] = [
    {
      ...SIDEBAR_ICONS.ARROW_LEFT,
      colorIcon: 'var(--brand-700)',
      width: '16px',
      height: '16px',
    },
  ];

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    this.userService.getMe().subscribe({
      next: (response) => {
        if (!response.data) {
          return;
        }

        this.headerData = {
          ...this.headerData,
          userMenuData: {
            ...this.headerData.userMenuData,
            userName: response.data.fullName || this.headerData.userMenuData.userName,
            userEmail: response.data.email || this.headerData.userMenuData.userEmail,
            userRole: response.data.role || this.headerData.userMenuData.userRole,
          },
        };
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load current user:', err);
      },
    });
  }

  handleComingSoon(feature: string): void {
    void feature;
  }

  handleSettings(): void {
    // Placeholder until settings route is available.
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
            this.router.navigate(['/auth']);
          },
          error: (err) => {
            console.error('❌ Logout failed:', err);
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
  }

  // Mobile Sidebar Toggle
  toggleMobileSidebar(): void {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }

  closeMobileSidebar(): void {
    this.isMobileSidebarOpen = false;
  }
}
