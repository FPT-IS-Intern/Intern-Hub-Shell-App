import { Component, Input, HostListener, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent, IconData } from '@goat-bravos/intern-hub-layout';

export interface HeaderAction {
  icon: IconData | string;
  content: string;
  method?: () => void;
  badge?: string;
  colorIcon?: string;
  width?: string;
  height?: string;
  url?: string;
}

export interface HeaderData {
  headerItems: HeaderAction[];
  userName: string;
  userEmail?: string;
  userRole?: string;
  userIcon?: IconData | string;
  userIconColor?: string;
  dropdownIcon?: IconData | string;
  dropdownIconColor?: string;
  logo?: string;
  userMenuItems?: HeaderAction[];
}

@Component({
  selector: 'app-header-component',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() data: HeaderData = {
    headerItems: [],
    userName: 'Guest',
    userIcon: 'dsi-user-01-line',
    dropdownIcon: 'dsi-arrow-down-solid',
    logo: 'assets/FPT-IS-Logo.png',
    userMenuItems: [],
  };

  @Input() paddingHeader: string = '12px 20px 12px 16px';

  private elementRef = inject(ElementRef);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isUserMenuOpen = false;
    }
  }

  isUserMenuOpen = false;

  toggleUserMenu(event: Event): void {
    event.stopPropagation();
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  handleActionClick(item: HeaderAction, event: Event): void {
    if (item.method) {
      event.preventDefault();
      item.method();
      this.isUserMenuOpen = false;
    }
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
