import { Component, ElementRef, HostListener, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent, IconData } from '@goat-bravos/intern-hub-layout';
import { UserMenuComponent, UserMenuData } from '../user-menu/user-menu.component';

export interface HeaderDropdownItem {
  title: string;
  description?: string;
  time?: string;
  unread?: boolean;
  createdAt?: number;
  method?: () => void;
}

export interface HeaderAction {
  icon: IconData | string;
  content: string;
  method?: () => void;
  badge?: string;
  colorIcon?: string;
  width?: string;
  height?: string;
  url?: string;
  dropdownType?: 'default' | 'notification';
  viewAllMethod?: () => void;
  notificationFilterChanged?: (filter: 'all' | 'unread') => void;
  notificationLoadMore?: () => void;
  notificationDropdownToggled?: (isOpen: boolean) => void;
  notificationLoading?: boolean;
  dropdownItems?: HeaderDropdownItem[];
}

export interface HeaderData {
  headerItems: HeaderAction[];
  logo?: string;
  userMenuData: UserMenuData;
}

@Component({
  selector: 'app-header-component',
  standalone: true,
  imports: [CommonModule, IconComponent, UserMenuComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  private readonly elementRef = inject(ElementRef);
  private readonly notificationScrollbarThumbHeight = 44;

  @Input() data: HeaderData = {
    headerItems: [],
    logo: 'assets/FPT-IS-Logo.png',
    userMenuData: {
      userName: 'Guest',
      userIcon: 'dsi-user-01-line',
      dropdownIcon: 'dsi-arrow-down-solid',
      userMenuItems: [],
    },
  };

  @Input() paddingHeader: string = '12px 20px 12px 16px';
  openDropdownIndex: number | null = null;
  notificationFilter: 'all' | 'unread' = 'all';
  notificationScrollbarVisible = false;
  notificationScrollbarThumbTop = 0;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      const openIndex = this.openDropdownIndex;
      this.openDropdownIndex = null;

      if (openIndex !== null) {
        const openItem = this.data.headerItems[openIndex];
        if (openItem?.dropdownType === 'notification') {
          openItem.notificationDropdownToggled?.(false);
        }
      }
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.scheduleNotificationScrollbarUpdate();
  }

  handleActionClick(item: HeaderAction, event: Event, index: number): void {
    if (item.dropdownItems) {
      event.preventDefault();
      event.stopPropagation();
      const isOpen = this.openDropdownIndex !== index;
      this.openDropdownIndex = isOpen ? index : null;

      if (item.dropdownType === 'notification') {
        this.notificationFilter = 'all';
        item.notificationDropdownToggled?.(isOpen);
      }

      this.scheduleNotificationScrollbarUpdate();
      return;
    }

    if (item.method) {
      event.preventDefault();
      item.method();
    }
  }

  handleDropdownItemClick(dropdownItem: HeaderDropdownItem, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    dropdownItem.method?.();
    this.openDropdownIndex = null;
  }

  setNotificationFilter(filter: 'all' | 'unread', event: Event, item: HeaderAction): void {
    event.preventDefault();
    event.stopPropagation();
    this.notificationFilter = filter;
    item.notificationFilterChanged?.(filter);
    this.scheduleNotificationScrollbarUpdate();
  }

  handleViewAll(item: HeaderAction, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    item.viewAllMethod?.();
  }

  getDisplayedDropdownItems(item: HeaderAction): HeaderDropdownItem[] {
    const items = item.dropdownItems ?? [];
    if (item.dropdownType !== 'notification') {
      return items;
    }

    if (this.notificationFilter === 'unread') {
      return items.filter((i) => !!i.unread);
    }

    return items;
  }

  getNotificationGroups(item: HeaderAction): Array<{ label: string; items: HeaderDropdownItem[] }> {
    const displayedItems = this.getDisplayedDropdownItems(item);
    const groupMap = new Map<string, HeaderDropdownItem[]>();

    displayedItems.forEach((dropdownItem) => {
      const label = this.getNotificationGroupLabel(dropdownItem.createdAt);
      const current = groupMap.get(label) ?? [];
      current.push(dropdownItem);
      groupMap.set(label, current);
    });

    return Array.from(groupMap.entries()).map(([label, items]) => ({ label, items }));
  }

  onNotificationScroll(scrollElement: HTMLElement, item: HeaderAction): void {
    this.updateNotificationScrollbar(scrollElement);
    const remaining = scrollElement.scrollHeight - scrollElement.clientHeight - scrollElement.scrollTop;
    if (item.dropdownType === 'notification' && remaining <= 24) {
      item.notificationLoadMore?.();
    }
  }

  private scheduleNotificationScrollbarUpdate(): void {
    setTimeout(() => {
      const scrollElement = this.elementRef.nativeElement.querySelector('.header-dropdown-scroll') as HTMLElement | null;
      if (!scrollElement) {
        this.notificationScrollbarVisible = false;
        this.notificationScrollbarThumbTop = 0;
        return;
      }
      this.updateNotificationScrollbar(scrollElement);
    }, 0);
  }

  private updateNotificationScrollbar(scrollElement: HTMLElement): void {
    const scrollableHeight = scrollElement.scrollHeight - scrollElement.clientHeight;
    this.notificationScrollbarVisible = scrollableHeight > 0;

    if (!this.notificationScrollbarVisible) {
      this.notificationScrollbarThumbTop = 0;
      return;
    }

    const trackHeight = scrollElement.clientHeight;
    const maxThumbTop = Math.max(0, trackHeight - this.notificationScrollbarThumbHeight);
    const scrollProgress = scrollableHeight > 0 ? scrollElement.scrollTop / scrollableHeight : 0;
    this.notificationScrollbarThumbTop = Math.round(maxThumbTop * scrollProgress);
  }

  private getNotificationGroupLabel(createdAt?: number): string {
    if (!createdAt) {
      return 'KHÁC';
    }

    const createdDate = new Date(createdAt);
    const now = new Date();
    const isToday =
      createdDate.getDate() === now.getDate() &&
      createdDate.getMonth() === now.getMonth() &&
      createdDate.getFullYear() === now.getFullYear();

    if (isToday) {
      return 'HÔM NAY';
    }

    const day = String(createdDate.getDate()).padStart(2, '0');
    const month = String(createdDate.getMonth() + 1).padStart(2, '0');
    const year = createdDate.getFullYear();
    return `${day}/${month}/${year}`;
  }

  getIconData(
    icon: IconData | string | undefined,
    colorIcon?: string,
    width?: string,
    height?: string,
  ): IconData | undefined {
    if (!icon) return undefined;

    if (typeof icon === 'string') {
      return {
        icon,
        colorIcon,
        width,
        height,
      };
    }

    return icon;
  }
}
