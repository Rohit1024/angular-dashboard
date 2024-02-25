import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { SigninComponent } from './signin.component';
import { SignupComponent } from './signup.component';
import { ForgotPasswordComponent } from './forgot-password.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'auth-layout',
  standalone: true,
  imports: [
    MatCardModule,
    MatTabsModule,
    SigninComponent,
    SignupComponent,
    ForgotPasswordComponent,
    RouterModule,
    MatIconModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Get Started</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <nav
          style="margin: 10px 0px;"
          mat-tab-nav-bar
          mat-stretch-tabs
          mat-align-tabs="start"
          [tabPanel]="tabPanel"
        >
          @for (link of authTabs; track link) {
          <a
            mat-tab-link
            [routerLink]="link.route"
            routerLinkActive
            #rla="routerLinkActive"
            [active]="rla.isActive"
          >
            <mat-icon>{{ link.icon }}</mat-icon>
            <span style="margin-left: 8px;">{{ link.label }}</span>
          </a>
          }
        </nav>
        <mat-tab-nav-panel #tabPanel> <router-outlet /></mat-tab-nav-panel>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      mat-card-content {
        margin-top: 20px;
      }

      mat-card {
        width: 600px;
        min-width: 400px;
        margin: 5% auto;
        box-shadow: 0 0 10px 1px #00000030 !important;
      }
    `,
  ],
})
export class AuthLayoutComponent {
  authTabs = [
    {
      icon: 'login',
      label: 'Sign In',
      route: 'signin',
    },
    {
      icon: 'person_add',
      label: 'Sign Up',
      route: 'signup',
    },
  ];
}
