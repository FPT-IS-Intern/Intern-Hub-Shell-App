import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent, HeaderData } from '../../components/header/header.component';
import { SidebarComponent, SidebarData } from '../../components/sidebar/sidebar.component';
import { FaceRegistrationDialogComponent } from '../../components/face-registration-dialog/face-registration-dialog.component';
import { IconData } from '@goat-bravos/intern-hub-layout';
import { AuthService } from '../../services/auth.service';
import { StorageUtil } from '@goat-bravos/shared-lib-client';
import { UserService } from '../../services/user.service';
import { SIDEBAR_ICONS } from '../../core/sidebar-icons';
import { NotificationService } from '../../services/notification.service';
import { InAppNotificationResponse } from '../../models/notification.model';
import { catchError, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-shell-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent, FaceRegistrationDialogComponent],
  templateUrl: './shell-layout.component.html',
  styleUrls: ['./shell-layout.component.scss'],
})
export class ShellLayoutComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private notificationFilter: 'all' | 'unread' = 'all';
  private notificationPage = 0;
  private readonly notificationPageSize = 10;
  private notificationHasMore = true;
  private notificationLoading = false;
  private currentNotificationItems: InAppNotificationResponse[] = [];
  private currentUnreadCount = 0;

  // Mobile sidebar state
  isMobileSidebarOpen = false;

  // Desktop sidebar state
  isSidebarExpanded = false;

  // Face registration state
  showFaceRegistrationDialog = false;
  faceRegistrationUserName = '';
  private isFaceRegistered = false;

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
        dropdownType: 'notification',
        viewAllMethod: () => this.handleNotificationViewAll(),
        notificationFilterChanged: (filter) => this.handleNotificationFilterChange(filter),
        notificationLoadMore: () => this.loadMoreNotifications(),
        badge: '0',
        dropdownItems: [],
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
          url: 'hrm/profile',
        },
        {
          icon: 'dsi-face-id-line',
          content: 'Đăng ký khuôn mặt',
          method: () => this.handleOpenFaceRegistration(),
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
    toggleButtonIconColor: 'var(--neutral-color-10)',
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
      colorIcon: 'var(--neutral-color-10)',
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
    this.loadNotifications('all');
  }

  private loadCurrentUser(): void {
    this.userService.getMe().subscribe({
      next: (response) => {
        if (!response.data) {
          return;
        }

        // Lấy phần trước @ trong email, lowercase
        const email = response.data.email || '';
        const atIndex = email.indexOf('@');
        this.faceRegistrationUserName = (atIndex > 0 ? email.substring(0, atIndex) : email).toLowerCase();

        // Cập nhật trạng thái đăng ký khuôn mặt
        this.isFaceRegistered = response.data.isFaceRegistry === true;

        // Cập nhật menu item đăng ký khuôn mặt
        const updatedUserMenuItems = [...this.headerData.userMenuData.userMenuItems!];
        const faceMenuIndex = updatedUserMenuItems.findIndex((item) => item.content === 'Đăng ký khuôn mặt');
        if (faceMenuIndex >= 0) {
          updatedUserMenuItems[faceMenuIndex] = {
            ...updatedUserMenuItems[faceMenuIndex],
            disabled: this.isFaceRegistered,
            tooltip: this.isFaceRegistered ? 'Bạn đã đăng ký khuôn mặt rồi' : undefined,
          };
        }

        this.headerData = {
          ...this.headerData,
          userMenuData: {
            ...this.headerData.userMenuData,
            userName: response.data.fullName || this.headerData.userMenuData.userName,
            userEmail: response.data.email || this.headerData.userMenuData.userEmail,
            userRole: response.data.role || this.headerData.userMenuData.userRole,
            userMenuItems: updatedUserMenuItems,
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

  handleNotificationClick(notification: InAppNotificationResponse): void {
    if (!notification.read) {
      this.notificationService.markOneAsRead(notification.id).subscribe({
        next: () => {
          this.loadNotifications(this.notificationFilter);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Failed to mark notification as read:', err);
        },
      });
    }

    this.handleNotificationAction(notification.actionData);
  }

  handleNotificationViewAll(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.loadNotifications(this.notificationFilter);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to mark all notifications as read:', err);
      },
    });
  }

  handleSettings(): void {
    // Placeholder until settings route is available.
  }

  handleOpenFaceRegistration(): void {
    if (this.isFaceRegistered) {
      return;
    }
    this.showFaceRegistrationDialog = true;
  }

  closeFaceRegistrationDialog(): void {
    this.showFaceRegistrationDialog = false;
  }

  onFaceRegistered(): void {
    this.isFaceRegistered = true;

    // Cập nhật menu item
    const updatedUserMenuItems = [...this.headerData.userMenuData.userMenuItems!];
    const faceMenuIndex = updatedUserMenuItems.findIndex((item) => item.content === 'Đăng ký khuôn mặt');
    if (faceMenuIndex >= 0) {
      updatedUserMenuItems[faceMenuIndex] = {
        ...updatedUserMenuItems[faceMenuIndex],
        disabled: true,
        tooltip: 'Bạn đã đăng ký khuôn mặt rồi',
      };
    }

    this.headerData = {
      ...this.headerData,
      userMenuData: {
        ...this.headerData.userMenuData,
        userMenuItems: updatedUserMenuItems,
      },
    };
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

  private loadNotifications(filter: 'all' | 'unread' = 'all'): void {
    if (this.notificationLoading) {
      return;
    }
    this.notificationFilter = filter;
    this.notificationPage = 0;
    this.notificationHasMore = true;
    this.currentNotificationItems = [];
    const isRead = filter === 'all' ? undefined : false;
    this.notificationLoading = true;

    forkJoin({
      unreadCount: this.notificationService.getUnreadCount().pipe(catchError(() => of({ data: 0 }))),
      notifications: this.notificationService
        .getMyNotifications(this.notificationPage, this.notificationPageSize, isRead)
        .pipe(catchError(() => of({ data: [] as InAppNotificationResponse[] }))),
    }).subscribe(({ unreadCount, notifications }) => {
      const pageItems = notifications.data ?? [];
      this.currentUnreadCount = unreadCount.data ?? 0;
      this.currentNotificationItems = pageItems;
      this.notificationHasMore = pageItems.length >= this.notificationPageSize;
      this.applyNotificationsToHeader();
      this.notificationLoading = false;
    });
  }

  private loadMoreNotifications(): void {
    if (this.notificationLoading || !this.notificationHasMore) {
      return;
    }

    this.notificationLoading = true;
    const nextPage = this.notificationPage + 1;
    const isRead = this.notificationFilter === 'all' ? undefined : false;
    this.notificationService
      .getMyNotifications(nextPage, this.notificationPageSize, isRead)
      .pipe(catchError(() => of({ data: [] as InAppNotificationResponse[] })))
      .subscribe((notifications) => {
        const pageItems = notifications.data ?? [];
        if (pageItems.length === 0) {
          this.notificationHasMore = false;
          this.notificationLoading = false;
          return;
        }

        this.notificationPage = nextPage;
        this.notificationHasMore = pageItems.length >= this.notificationPageSize;
        this.currentNotificationItems = [...this.currentNotificationItems, ...pageItems];
        this.applyNotificationsToHeader();
        this.notificationLoading = false;
      });
  }

  private applyNotificationsToHeader(): void {
    const bellItemIndex = this.headerData.headerItems.findIndex((item) => item.icon === 'custom-icon-bell');
    if (bellItemIndex < 0) {
      return;
    }

    const list = [...this.currentNotificationItems].sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
    const mappedItems = list.map((item) => ({
      title: item.title,
      description: item.content,
      time: this.formatNotificationTime(item.createdAt),
      unread: !item.read,
      createdAt: item.createdAt,
      method: () => this.handleNotificationClick(item),
    }));

    const nextHeaderItems = [...this.headerData.headerItems];
    nextHeaderItems[bellItemIndex] = {
      ...nextHeaderItems[bellItemIndex],
      badge: String(this.currentUnreadCount),
      dropdownItems: mappedItems,
    };

    this.headerData = {
      ...this.headerData,
      headerItems: nextHeaderItems,
    };
  }

  private formatNotificationTime(createdAt?: number): string {
    if (!createdAt) {
      return '';
    }

    const date = new Date(createdAt);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  }

  handleNotificationFilterChange(filter: 'all' | 'unread'): void {
    this.notificationFilter = filter;
    this.loadNotifications(filter);
  }

  private handleNotificationAction(actionData: InAppNotificationResponse['actionData']): void {
    const payload = this.normalizeActionData(actionData);
    if (!payload) {
      return;
    }

    const targetUrl = typeof payload['targetUrl'] === 'string' ? payload['targetUrl'].trim() : '';
    if (targetUrl) {
      this.navigateByActionTarget(targetUrl);
    }
  }

  private navigateByActionTarget(target: string): void {
    if (!target) {
      return;
    }
    if (/^https?:\/\//i.test(target)) {
      window.location.href = target;
      return;
    }
    this.router.navigateByUrl(target);
  }

  private normalizeActionData(
    actionData: InAppNotificationResponse['actionData'],
  ): Record<string, unknown> | null {
    if (!actionData) {
      return null;
    }

    if (typeof actionData === 'string') {
      try {
        const parsed = JSON.parse(actionData);
        return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null;
      } catch {
        return null;
      }
    }

    return actionData as Record<string, unknown>;
  }
}
