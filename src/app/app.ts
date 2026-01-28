import { Component, inject, signal, OnInit } from '@angular/core';
import { DynamicDsService } from 'dynamic-ds';
import { MainLayoutTestComponent } from '../libs/layouts/main-layout-test/main-layout-test.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MainLayoutTestComponent,
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
