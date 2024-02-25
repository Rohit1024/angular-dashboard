import { Routes } from '@angular/router';
import { ProfileAuthComponent } from './auth.component';
import { ProfilePasswordComponent } from './password.component';
import { ProfileDetailsComponent } from './details.component';
import { NotFoundComponent } from '../../components/not-found.component';

export const profile_routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'details',
  },
  {
    path: 'details',
    component: ProfileDetailsComponent,
  },
  {
    path: 'authentication',
    component: ProfileAuthComponent,
  },
  {
    path: 'password',
    component: ProfilePasswordComponent,
  },
  {
    path: '**',
    pathMatch: 'full',
    component: NotFoundComponent,
  },
];
