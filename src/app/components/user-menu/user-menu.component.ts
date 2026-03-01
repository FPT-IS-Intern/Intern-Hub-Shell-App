import { Component, Input, HostListener, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IconComponent, IconData } from '@goat-bravos/intern-hub-layout';

export interface UserMenuAction {
  icon: IconData | string;
  content: string;
  method?: () => void;
  colorIcon?: string;
  url?: string;
}

export interface UserMenuData {
  userName: string;
  userEmail?: string;
  userRole?: string;
  userIcon?: IconData | string;
  userIconColor?: string;
  dropdownIcon?: IconData | string;
  dropdownIconColor?: string;
  userMenuItems?: UserMenuAction[];
}

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent {
  @Input() data: UserMenuData = {
    userName: 'Guest',
    userIcon: 'dsi-user-01-line',
    dropdownIcon: 'dsi-arrow-down-solid',
    userMenuItems: [],
  };

  private elementRef = inject(ElementRef);
  private router = inject(Router);
  isUserMenuOpen = false;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isUserMenuOpen = false;
    }
  }

  toggleUserMenu(event: Event): void {
    event.stopPropagation();
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  handleActionClick(item: UserMenuAction, event: Event): void {
    if (item.url) {
      event.preventDefault();
      const targetUrl = item.url.startsWith('/') ? item.url : `/${item.url}`;
      this.router.navigateByUrl(targetUrl);
      this.isUserMenuOpen = false;
      return;
    }

    if (item.method) {
      event.preventDefault();
      item.method();
      this.isUserMenuOpen = false;
    }
  }

  getIconData(
    icon: IconData | string | undefined,
    colorIcon?: string,
    width: string = '16px',
    height: string = '16px',
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
