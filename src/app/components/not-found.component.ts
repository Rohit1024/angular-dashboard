import { MatCardModule } from '@angular/material/card';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'not-found',
  standalone: true,
  imports: [MatCardModule, RouterLink],
  template: `
    <mat-card>
      <mat-card-content
        ><h1>404 Not Found</h1>
        <span
          >The page you were looking for is not exist
          <a routerLink="/">Go Home</a>
        </span></mat-card-content
      >
    </mat-card>
  `,
})
export class NotFoundComponent {}
