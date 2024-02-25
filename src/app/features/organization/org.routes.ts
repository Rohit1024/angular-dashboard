import { Routes } from '@angular/router';
import { NotFoundComponent } from '../../components/not-found.component';
import { OrganizationGeneralComponent } from './general.component';
import { OrganizationMembersComponent } from './members.component';
import { OrganizationInvitesComponent } from './invites.component';

export const org_routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'general',
  },
  {
    path: 'general',
    component: OrganizationGeneralComponent,
  },
  {
    path: 'members',
    component: OrganizationMembersComponent,
  },
  {
    path: 'invites',
    component: OrganizationInvitesComponent,
  },
  {
    path: '**',
    pathMatch: 'full',
    component: NotFoundComponent,
  },
];
