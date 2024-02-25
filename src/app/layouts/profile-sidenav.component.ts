import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { CustomSidenavComponent } from '../components/custom-sidenav.component';

@Component({
  selector: 'profile-sidebar',
  standalone: true,
  imports: [
    MatSidenavModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    CustomSidenavComponent,
  ],
  template: `
    <mat-sidenav-container>
      <mat-sidenav opened mode="side" [style.width]="'250px'">
        <app-custom-sidenav [menuItems]="profilePages" />
      </mat-sidenav>
      <mat-sidenav-content class="content" [style.margin-left]="'250px'">
        <router-outlet />
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      .content {
        padding: 20px;
      }

      mat-sidenav-container {
        height: calc(100vh - 200px);
      }
    `,
  ],
})
export class ProfileSidebarComponent {
  profilePages = [
    {
      icon: 'account_box',
      label: 'My Details',
      route: 'details',
    },
    {
      icon: 'security',
      label: 'Authentication',
      route: 'authentication',
    },
    {
      icon: 'vpn_key',
      label: 'Password',
      route: 'password',
    },
  ];
}
