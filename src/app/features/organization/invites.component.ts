import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'organization-invites',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatChipsModule,
  ],
  template: `
    <mat-card>
      <mat-card-header
        style="display: flex; flex-direction: column; margin:0 10px;"
      >
        <h1>Pending Invites</h1>
        <h4>Manage invites not yet accepted</h4>
      </mat-card-header>
      <mat-card-content style="margin: 0 10px;">
        <mat-list>
          @for (invite of members; track $index) {
          <mat-list-item>
            <img
              matListItemAvatar
              height="20"
              width="20"
              src="/assets/image-placeholder.png"
            />
            <h3 matListItemTitle>{{ invite.email }}</h3>
            <p matListItemLine>
              <span>{{ invite.role }}</span>
            </p>
            <button
              matListItemMeta
              mat-icon-button
              style="margin-top: 10px;"
              (click)="remove(invite.email)"
            >
              <mat-icon style="margin-bottom: 10px;">close</mat-icon>
            </button>
          </mat-list-item>
          } @empty {
          <p>No pending invites found</p>
          }
        </mat-list>
      </mat-card-content>
    </mat-card>
  `,
})
export class OrganizationInvitesComponent {
  members = [
    {
      email: 'john@gmail.com',
      role: 'Member',
    },
    {
      email: 'steve@gmail.com',
      role: 'Admin',
    },
  ];

  remove(email: string) {
    this.members = this.members.filter((member) => member.email !== email);
  }
}
