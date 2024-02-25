import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UsersService } from '../../services/users.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'auth-signin',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
  ],
  template: `
    <form
      [formGroup]="signinForm"
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
        @if(handleErrorLogin('email', 'required')) {
        <mat-error>Email is required </mat-error>
        } @if(handleErrorLogin('email', 'email')){
        <mat-error>Email should be of Valid Format</mat-error>
        }
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Password</mat-label>
        <input
          matInput
          placeholder="Password"
          [type]="passwordHide ? 'password' : 'text'"
          required
          minlength="6"
          formControlName="password"
        />
        <button
          mat-icon-button
          matSuffix
          type="button"
          (click)="passwordHide = !passwordHide"
          [attr.aria-label]="'Hide password'"
          [attr.aria-pressed]="passwordHide"
        >
          @if(passwordHide){
          <mat-icon matSuffix>visibility_off</mat-icon>
          } @if(!passwordHide) {
          <mat-icon matSuffix>visibility</mat-icon>
          }
        </button>
        @if(handleErrorLogin('password', 'required')) {
        <mat-error>Password is required</mat-error>
        }
      </mat-form-field>
      <a routerLink="/forgot-password">forgot password ?</a>
      <button style="width: 100%;" mat-fab extended type="submit">
        <mat-icon>login</mat-icon>
        Sign In
      </button>

      <button
        mat-fab
        extended
        color="primary"
        type="button"
        style="width: 100%;"
        (click)="signInWithGoogle()"
      >
        Login with Google
      </button>
    </form>
  `,
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
export class SigninComponent {
  fb = inject(NonNullableFormBuilder);
  authService = inject(AuthService);
  userService = inject(UsersService);
  toast = inject(HotToastService);
  router = inject(Router);
  passwordHide = true;

  signinForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit() {
    if (
      !this.signinForm.valid ||
      !this.signinForm.value.email ||
      !this.signinForm.value.password
    )
      return;
    console.table(this.signinForm.value);
    const { email, password } = this.signinForm.value;
    this.authService
      .login({
        email,
        password,
      })
      .pipe(
        this.toast.observe({
          success: ({ user }) => `Logged in successfully with ${user.email}`,
          loading: 'Logging in...',
          error: ({ code }) => `${code}`,
        })
      )
      .subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: console.log,
      });
  }

  signInWithGoogle() {
    this.authService
      .signInWithGoogle()
      .pipe(
        switchMap(({ user: { uid, email, displayName } }) =>
          this.userService.addUser({
            uid,
            email: email!,
            displayName: displayName!,
            role: 'user',
          })
        )
      )
      .pipe(
        this.toast.observe({
          success: 'Signed in successfully',
          loading: 'Logging in...',
          error: ({ code }) => `${code}`,
        })
      )
      .subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: console.log,
      });
  }

  /* Get errors */
  public handleErrorLogin(controlName: string, errorName: string) {
    return (
      this.signinForm.get(controlName)?.touched &&
      this.signinForm.get(controlName)?.errors &&
      this.signinForm.get(controlName)?.hasError(errorName)
    );
  }
}
