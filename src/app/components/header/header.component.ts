import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent, IconData } from '@goat-bravos/intern-hub-layout';
import { UserMenuComponent, UserMenuData } from '../user-menu/user-menu.component';
import { FeatureDropdownComponent } from '../feature-dropdown/feature-dropdown';

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
  logo?: string;
  userMenuData: UserMenuData;
}

@Component({
  selector: 'app-header-component',
  standalone: true,
  imports: [CommonModule, UserMenuComponent, FeatureDropdownComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
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

  handleActionClick(item: HeaderAction, event: Event): void {
    if (item.method) {
      event.preventDefault();
      item.method();
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
