import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'organization-members',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatListModule,
    MatMenuModule,
  ],
  template: `
    <mat-card>
      <mat-card-header
        style="display: flex; flex-direction: column; margin:0 10px;"
      >
        <h1>Members</h1>
        <h4>Manage and Invite members</h4>
      </mat-card-header>
      <mat-card-content>
        <mat-form-field appearance="outline" style="margin: 0 10px;">
          <mat-label>Search member</mat-label>
          <input matInput type="text" (keyup)="filter($event)" />
          <button mat-stroked-button matSuffix style="margin-right: 10px;">
            <mat-icon>person_add</mat-icon>
            Invite Members
          </button>
        </mat-form-field>
        <mat-list>
          @for (invite of filteredMembers; track $index) {
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
              [matMenuTriggerFor]="menu"
              style="margin-top: 10px;"
            >
              <mat-icon style="margin-bottom: 10px;">more_vert</mat-icon>
            </button>
          </mat-list-item>
          } @empty {
          <p style="margin: 0 12px;">
            No members found with "{{ filterValue }}"
          </p>
          }
        </mat-list>
      </mat-card-content>
    </mat-card>

    <mat-menu #menu="matMenu">
      <button mat-menu-item>
        <mat-icon>manage_accounts</mat-icon>
        <span>Change Role</span>
      </button>
      <button mat-menu-item class="danger">
        <mat-icon class="danger">close</mat-icon>
        <span>Remove</span>
      </button>
    </mat-menu>
  `,
  styles: [
    `
      mat-form-field {
        width: 100%;
      }

      .danger {
        color: red;
      }
    `,
  ],
})
export class OrganizationMembersComponent {
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

  filteredMembers = this.members;
  filterValue: string = '';

  filter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.filteredMembers = this.members.filter(
      (member) =>
        member.email.toLowerCase().includes(this.filterValue.toLowerCase()) ||
        member.role.toLowerCase().includes(this.filterValue.toLowerCase())
    );
  }
}
