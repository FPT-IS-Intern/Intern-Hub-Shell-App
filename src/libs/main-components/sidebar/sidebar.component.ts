import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarItemComponent } from "../../components/sidebar-item/sidebar-item.component";

interface MenuItem {
  label: string;
  hasIcon?: boolean;
  hasChevron?: boolean;
  isHighlighted?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, SidebarItemComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

}
