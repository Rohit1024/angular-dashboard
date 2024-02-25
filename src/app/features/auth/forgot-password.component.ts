import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'auth-forgot-password',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `<form
    [formGroup]="forgotForm"
    (ngSubmit)="onSubmit()"
    style="margin-top: 40px;"
  >
    <mat-form-field appearance="outline">
      <mat-label>Email</mat-label>
      <input
        matInput
        placeholder="Email"
        required
        name="email"
        formControlName="email"
      />
      <mat-icon matSuffix>email</mat-icon>
      @if(handleError('email', 'required')) {
      <mat-error>Email is required </mat-error>
      } @if(handleError('email', 'email')){
      <mat-error>Email should be of Valid Format</mat-error>
      }
    </mat-form-field>
    <button style="width: 100%;" mat-fab extended type="submit">
      <mat-icon>mail</mat-icon>
      Send Password Reset Link
    </button>
  </form>`,
  styles: [
    `
      mat-form-field {
        width: 100%;
      }

      form {
        padding: 10px 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent {
  fb = inject(NonNullableFormBuilder);
  authService = inject(AuthService);
  toast = inject(HotToastService);
  router = inject(Router);

  forgotForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  handleError(controlName: string, errorName: string) {
    return (
      this.forgotForm.get(controlName)?.touched &&
      this.forgotForm.get(controlName)?.errors &&
      this.forgotForm.get(controlName)?.hasError(errorName)
    );
  }

  onSubmit() {}
}
