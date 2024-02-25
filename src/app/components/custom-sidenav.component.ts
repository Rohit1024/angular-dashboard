import { Component, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MenuItem } from '../shared/models';

@Component({
  selector: 'app-custom-sidenav',
  standalone: true,
  imports: [MatListModule, MatIconModule, RouterModule],
  template: `
    <mat-nav-list>
      @for (item of menuItems(); track $index) {
      <a
        mat-list-item
        class="menu-item"
        [routerLink]="item.route"
        routerLinkActive="selected-menu-item"
        #rla="routerLinkActive"
        [activated]="rla.isActive"
      >
        <mat-icon
          [fontSet]="
            rla.isActive ? 'material-icons' : 'material-icons-outlined'
          "
          matListItemIcon
          >{{ item.icon }}</mat-icon
        >
        @if (!collapsed()) {
        <span matListItemTitle>{{ item.label }}</span>
        }
      </a>
      }
    </mat-nav-list>
  `,
  styles: `
    .menu-item {
      border-left: 5px solid;
      border-left-color: rgba(0,0,0,0);
    }

    .selected-menu-item {
        border-left-color: #3f50b5;
        background : rgba(0,0,0,0.05);
      }
  `,
})
export class CustomSidenavComponent {
  collapsed = input<boolean>();

  menuItems = input.required<MenuItem[]>();
}
