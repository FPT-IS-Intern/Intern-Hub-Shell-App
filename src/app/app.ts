import { Component, inject, OnInit } from '@angular/core';
import { DynamicDsService } from 'dynamic-ds';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
})
export class App implements OnInit {
  private readonly themeService = inject(DynamicDsService);

  ngOnInit(): void {
    this.themeService.initializeTheme().subscribe();
  }
}
