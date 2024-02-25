import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './auth-tab.component';
import { SigninComponent } from './signin.component';
import { SignupComponent } from './signup.component';
import { ForgotPasswordComponent } from './forgot-password.component';
import { LandingComponent } from '../../components/home.component';
import { NotFoundComponent } from '../../components/not-found.component';

export const auth_routes: Routes = [
  {
    path: 'home',
    component: LandingComponent,
  },
  {
    path: 'signin',
    component: SigninComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: '**',
    pathMatch: 'full',
    component: NotFoundComponent,
  },
];
