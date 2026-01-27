import { Component, inject, signal, OnInit } from '@angular/core';
import { DynamicDsService } from 'dynamic-ds';
import {MainLayoutComponent} from '../libs/layouts/main-layout/main-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MainLayoutComponent,
],
  templateUrl: './app.component.html'
})
export class App implements OnInit {
  protected readonly title = signal('shell-app');

  private readonly themeService = inject(DynamicDsService);

  ngOnInit() {
    this.themeService.initializeTheme().subscribe();
  }
}
