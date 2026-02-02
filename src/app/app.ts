import { Component, inject, signal, OnInit } from '@angular/core';
import { DynamicDsService } from 'dynamic-ds';
import { ShellLayoutComponent } from '../libs/layouts/main-layout/shell-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ShellLayoutComponent],
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected readonly title = signal('shell-app');

  private readonly themeService = inject(DynamicDsService);

  ngOnInit() {
    this.themeService.initializeTheme().subscribe();
  }
}
