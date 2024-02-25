import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PublicLayoutComponent } from '../layouts/public-layout.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, PublicLayoutComponent],
  template: `
    <app-public-layout/>
    <mat-card>
      <mat-card-content>Simple card</mat-card-content>
    </mat-card>
  `,
})
export class LandingComponent { }
