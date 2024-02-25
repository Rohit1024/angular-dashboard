import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'settings-layout',
  standalone: true,
  imports: [
    RouterModule,
    MatDividerModule,
    MatTabsModule,
    MatIconModule,
    MatCardModule,
  ],
  template: `
    <div class="container">
      <h1>Settings</h1>
      <h4>Manage your settings and preferences.</h4>
      <mat-divider />
      <nav
        style="margin: 10px 0px;"
        mat-tab-nav-bar
        mat-stretch-tabs="false"
        mat-align-tabs="start"
        [tabPanel]="tabPanel"
      >
        @for (link of settingsTabs; track link) {
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
      <mat-tab-nav-panel #tabPanel><router-outlet /></mat-tab-nav-panel>
    </div>
  `,
  styles: [
    `
      .container {
        width: 100%;
        height: calc(100vh - 140px);
        display: flex;
        flex-direction: column;
        text-align: start;
      }
    `,
  ],
})
export class SettingsLayoutComponent {
  settingsTabs = [
    {
      icon: 'person',
      label: 'Profile',
      route: 'profile/details',
    },
    {
      icon: 'account_balance',
      label: 'Organization',
      route: 'organization/general',
    },
    {
      icon: 'credit_card',
      label: 'Subscription',
      route: 'subscription',
    },
  ];
}
