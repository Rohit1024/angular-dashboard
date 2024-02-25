import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import {
  AuthGuard,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { PostsComponent } from './features/posts/posts.component';
import { SecureLayoutComponent } from './layouts/secure-layoout.component';
import { SettingsLayoutComponent } from './layouts/settings-layout.component';
import { SubscriptionComponent } from './features/subscription/subscription.component';
import { ProfileSidebarComponent } from './layouts/profile-sidenav.component';
import { OrganizationSidebarComponent } from './layouts/org-sidenav.component';
import { LandingComponent } from './components/home.component';
import { AuthLayoutComponent } from './features/auth/auth-tab.component';

const redirectUnauthorizedToLogin = () =>
  redirectUnauthorizedTo(['/auth/signin']);
const redirectLoggedInToDashboard = () => redirectLoggedInTo(['/dashboard']);

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    component: LandingComponent,
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./features/auth/auth.routes').then((a) => a.auth_routes),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectLoggedInToDashboard },
  },
  {
    path: '',
    component: SecureLayoutComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'posts',
        component: PostsComponent,
      },
      {
        path: 'settings',
        component: SettingsLayoutComponent,
        children: [
          {
            path: 'profile',
            component: ProfileSidebarComponent,
            loadChildren: () =>
              import('./features/profile/profile.routes').then(
                (p) => p.profile_routes
              ),
          },
          {
            path: 'organization',
            component: OrganizationSidebarComponent,
            loadChildren: () =>
              import('./features/organization/org.routes').then(
                (childs) => childs.org_routes
              ),
          },
          {
            path: 'subscription',
            component: SubscriptionComponent,
          },
        ],
      },
    ],
  },
];
