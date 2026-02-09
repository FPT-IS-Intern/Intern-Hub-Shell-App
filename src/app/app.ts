import { Component, inject, signal, OnInit, Inject } from '@angular/core';
import { DynamicDsService, SYSTEM_DESIGN_CONFIG } from 'dynamic-ds';
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

  constructor(@Inject(SYSTEM_DESIGN_CONFIG) private readonly config: any) {
    console.log('Check config: ', this.config);
  }

  ngOnInit() {
    this.themeService.initializeTheme().subscribe(() => {
      console.log("init in shell app");}
      );
    this.themeService.updateSystemDesignColor({
        brandColor: '#E18308',
        primaryColor: '#006BDF',
        secondaryColor: '#9F5100',
        functionalColor: '#006BDF',
        utilityColor: '#CF0026'
    });
  }
}
