import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import { CustomSidenavComponent } from '../components/custom-sidenav.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { AsyncPipe } from '@angular/common';
import { ProfileUser } from '../shared/models';

@Component({
  selector: 'secure-layout',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    RouterModule,
    CustomSidenavComponent,
    MatToolbarModule,
    MatMenuModule,
    MatDividerModule,
    AsyncPipe,
  ],
  template: `
    <mat-toolbar color="primary">
      <button
        mat-icon-button
        class="example-icon"
        (click)="collapsed.set(!collapsed())"
      >
        <mat-icon>menu</mat-icon>
      </button>
      <span>My App</span>
      <span class="example-spacer"></span>
      <button mat-icon-button (click)="toggleTheme()">
        @if(!isDarkMode) {
        <mat-icon>brightness_5</mat-icon>
        } @else {
        <mat-icon>bedtime</mat-icon>
        }
      </button>
      @if(profileUser(); as user) {
      <button mat-icon-button [matMenuTriggerFor]="userMenu">
        <img
          class="profile-image-toolbar"
          [width]="'30px'"
          [height]="'30px'"
          [src]="user.photoURL ?? 'assets/image-placeholder.png'"
        />
      </button>
      }
    </mat-toolbar>
    <mat-sidenav-container>
      <mat-sidenav opened mode="side" [style.width]="sideNavWidth()">
        <app-custom-sidenav
          [menuItems]="sidebarItems"
          [collapsed]="collapsed()"
        />
      </mat-sidenav>
      <mat-sidenav-content class="content" [style.margin-left]="sideNavWidth()">
        <router-outlet />
      </mat-sidenav-content>
    </mat-sidenav-container>

    <mat-menu #userMenu="matMenu">
      <a mat-menu-item routerLink="/settings/profile">
        <mat-icon>account_box</mat-icon>
        <span>Profile</span>
      </a>
      <a mat-menu-item routerLink="/dashboard">
        <mat-icon>dashboard</mat-icon>
        <span>Dashboard</span>
      </a>
      <a mat-menu-item routerLink="/posts">
        <mat-icon>description</mat-icon>
        <span>Posts</span>
      </a>
      <mat-divider />
      <a mat-menu-item style="margin-top: 8px;" (click)="logout()">
        <mat-icon>logout</mat-icon>
        <span>Sign out</span>
      </a>
    </mat-menu>
  `,
  styles: [
    `
      .content {
        padding: 24px;
      }
      mat-sidenav-container {
        height: calc(100vh - 64px);
      }

      mat-sidenav,
      mat-sidenav-content {
        transition: all 200ms ease-in-out;
      }

      .profile-image-toolbar {
        border-radius: 100%;
      }

      .example-spacer {
        flex: 1;
      }
    `,
  ],
})
export class SecureLayoutComponent implements OnInit {
  isDarkMode = false;
  authService = inject(AuthService);
  userService = inject(UsersService);
  profileUser = signal<ProfileUser | null>(null);
  collapsed = signal<boolean>(false);
  route = inject(Router);

  ngOnInit() {
    this.userService.currentUserProfile$.subscribe((user) =>
      this.profileUser.set(user)
    );
  }

  sidebarItems = [
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: 'dashboard',
    },
    {
      icon: 'description',
      label: 'Posts',
      route: 'posts',
    },
    {
      icon: 'account_box',
      label: 'Profile',
      route: 'settings/profile/details',
    },
    {
      icon: 'account_balance',
      label: 'Organization',
      route: 'settings/organization',
    },
    {
      icon: 'credit_card',
      label: 'Subscription',
      route: 'settings/subscription',
    },
  ];

  @Output() emitTheme = new EventEmitter<boolean>();

  sideNavWidth = computed(() => (this.collapsed() ? '65px' : '250px'));

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.emitTheme.emit(this.isDarkMode);
  }

  logout() {
    this.authService.logout().subscribe();
    this.route.navigate(['/auth/signin']);
  }
}
