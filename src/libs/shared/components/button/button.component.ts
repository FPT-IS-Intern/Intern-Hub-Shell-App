import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shared-button',
  standalone: true,
  template: `
    <button class="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition">
      {{ label }}
    </button>
  `,
})
export class SharedButtonComponent {
  @Input() label: string = 'Button từ Shell';
}
