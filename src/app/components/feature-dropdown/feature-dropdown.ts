import { Component, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconData } from '@goat-bravos/intern-hub-layout';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-feature-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dropdown-wrapper">
      <button class="trigger-btn" (click)="toggle($event)" [title]="label">
        <div class="icon-container">
          <span [class]="iconClass"></span>
        </div>
      </button>

      @if (isOpen) {
        <div class="dropdown-panel">
          <div class="panel-content">
            <div class="working-icon">🚀</div>
            <div class="title">{{ label }}</div>
            <div class="status">Tính năng đang phát triển</div>
            <div class="divider"></div>
            <p class="desc">Chúng tôi đang nỗ lực hoàn thiện tính năng này sớm nhất.</p>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .dropdown-wrapper {
        position: relative;
        display: inline-block;
      }

      .trigger-btn {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: white;
        border-radius: 12px;
        border: 1px solid var(--neutral-color-100);
        cursor: pointer;
        color: var(--brand-700);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);

        &:hover {
          background-color: var(--brand-50);
          border-color: var(--brand-100);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(39, 64, 180, 0.1);
        }

        .icon-container {
          display: flex;
          align-items: center;
          justify-content: center;

          span {
            display: inline-block;
            width: 20px;
            height: 20px;
            background-color: currentColor;
          }
        }
      }

      .dropdown-panel {
        position: absolute;
        top: calc(100% + 12px);
        right: 0;
        width: 260px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
        border: 1px solid var(--neutral-color-100);
        padding: 16px;
        z-index: 1000;
        animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .panel-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;

        .working-icon {
          font-size: 32px;
          margin-bottom: 12px;
          animation: bounce 2s infinite;
        }

        .title {
          font-size: 15px;
          font-weight: 800;
          color: var(--neutral-color-900);
          margin-bottom: 4px;
        }

        .status {
          font-size: 13px;
          font-weight: 600;
          color: var(--brand-600);
          background: var(--brand-50);
          padding: 4px 12px;
          border-radius: 20px;
          margin-bottom: 12px;
        }

        .divider {
          width: 100%;
          height: 1px;
          background: var(--neutral-color-50);
          margin-bottom: 12px;
        }

        .desc {
          font-size: 12px;
          line-height: 1.5;
          color: var(--neutral-color-600);
          margin: 0;
        }
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes bounce {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-5px);
        }
      }
    `,
  ],
})
export class FeatureDropdownComponent {
  @Input() iconClass: string = '';
  @Input() label: string = '';

  isOpen = false;

  toggle(event: Event) {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  @HostListener('document:click')
  close() {
    this.isOpen = false;
  }
}
