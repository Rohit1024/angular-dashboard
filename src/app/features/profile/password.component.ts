import { Component, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import Validation from '../../shared/Validation';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../services/auth.service';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';

@Component({
  selector: 'profile-password',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  template: `
    <mat-card>
      <mat-card-header
        style="display: flex; flex-direction: column; margin:0 10px;"
      >
        <h1>Password</h1>
        <h4>
          Update your Email Password
          <mat-icon
            style="margin: -5px 5px;"
            [matTooltip]="message"
            [matTooltipPosition]="'right'"
            >info</mat-icon
          >
        </h4>
      </mat-card-header>
      <mat-card-content>
        <form
          style="margin:0 10px;"
          [formGroup]="passwordForm"
          (ngSubmit)="onSubmit()"
        >
          <mat-form-field appearance="outline">
            <mat-label>Current Password</mat-label>
            <input
              matInput
              [type]="hide ? 'password' : 'text'"
              formControlName="currentPassword"
            />
            <button
              mat-icon-button
              matSuffix
              (click)="hide = !hide"
              [attr.aria-label]="'Hide password'"
              [attr.aria-pressed]="hide"
            >
              <mat-icon>{{ hide ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <mat-error></mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>New Password</mat-label>
            <input
              matInput
              [type]="hide ? 'password' : 'text'"
              formControlName="newPassword"
            />
            <button
              mat-icon-button
              matSuffix
              (click)="hide = !hide"
              [attr.aria-label]="'Hide password'"
              [attr.aria-pressed]="hide"
            >
              <mat-icon>{{ hide ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <mat-error></mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Confirm New Password</mat-label>
            <input
              matInput
              [type]="hide ? 'password' : 'text'"
              formControlName="repeatNewPassword"
            />
            <button
              mat-icon-button
              matSuffix
              (click)="hide = !hide"
              [attr.aria-label]="'Hide password'"
              [attr.aria-pressed]="hide"
            >
              <mat-icon>{{ hide ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <mat-error></mat-error>
          </mat-form-field>
          <mat-card-actions>
            <button style="width: 100%;" mat-fab extended="" color="primary">
              <mat-icon>lock_reset</mat-icon> Update Account Password
            </button>
          </mat-card-actions>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      mat-form-field {
        width: 100%;
      }
    `,
  ],
})
export class ProfilePasswordComponent {
  hide = true;
  message = "You'll be Re-authenticated in order to update the Password";

  fb = inject(NonNullableFormBuilder);
  authService = inject(AuthService);
  toast = inject(HotToastService);
  router = inject(Router);
  passwordForm = this.fb.group(
    {
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      repeatNewPassword: ['', Validators.required],
    },
    {
      validators: Validation.match('newPassword', 'repeatNewPassword'),
    }
  );

  onSubmit() {
    if (
      !this.passwordForm.valid ||
      !this.passwordForm.value.currentPassword ||
      !this.passwordForm.value.newPassword
    )
      return;
    console.table(this.passwordForm.value);
    const { currentPassword, newPassword } = this.passwordForm.value;
    this.authService.reauthticateUser(currentPassword).subscribe({
      next: (crendetial) => {
        this.authService
          .updateUserPassword(crendetial.user, newPassword)
          .subscribe({
            next: () => {
              this.toast.success(
                'Password Sucessfully changed. Please sign in again'
              );
              this.authService
                .logout()
                .subscribe(() => this.router.navigate(['/auth/signin']));
            },
          });
      },
      error: ({ code }) => this.toast.error(code),
    });
  }
}
