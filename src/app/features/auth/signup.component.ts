import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import Validation from '../../shared/Validation';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'auth-signup',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `<form
    [formGroup]="sigupForm"
    (ngSubmit)="onSubmit()"
    style="margin-top: 40px;"
  >
    <mat-form-field appearance="outline">
      <input
        matInput
        placeholder="Display Name"
        required
        name="text"
        formControlName="displayName"
      />
      <mat-icon matSuffix>email</mat-icon>
      @if(handleErrorRegister('displayName', 'required')){
      <mat-error>Display Name is required</mat-error>
      } @if(handleErrorRegister('displayName', 'minlength')) {
      <mat-error
        ><small
          >Display Name must be of length atleast 3 characters long</small
        ></mat-error
      >
      }
    </mat-form-field>
    <mat-form-field appearance="outline">
      <input
        matInput
        placeholder="Email"
        required
        name="email"
        formControlName="email"
      />
      <mat-icon matSuffix>email</mat-icon>
      @if(handleErrorRegister('email', 'required')){
      <mat-error>Email is required</mat-error>
      } @if(handleErrorRegister('email', 'email')){
      <mat-error>Email should be of Valid Format</mat-error>
      }
    </mat-form-field>
    <mat-form-field appearance="outline">
      <input
        matInput
        placeholder="Password"
        [type]="passwordHide ? 'password' : 'text'"
        required
        minlength="6"
        name="password"
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
        } @else{
        <mat-icon matSuffix>visibility</mat-icon>
        }
      </button>
      @if(handleErrorRegister('password', 'required')){
      <mat-error>Password is required</mat-error>
      } @if(handleErrorRegister('password', 'minlength')){
      <mat-error>Password must be of length 6</mat-error>}
    </mat-form-field>
    <mat-form-field appearance="outline">
      <input
        matInput
        placeholder="Confirm Password"
        [type]="confirmPasswordHide ? 'password' : 'text'"
        required
        name="repassword"
        formControlName="confirmPassword"
      />
      <button
        mat-icon-button
        matSuffix
        type="button"
        (click)="confirmPasswordHide = !confirmPasswordHide"
        [attr.aria-label]="'Hide password'"
        [attr.aria-pressed]="confirmPasswordHide"
      >
        @if(confirmPasswordHide){
        <mat-icon matSuffix>visibility_off</mat-icon>
        } @else{
        <mat-icon matSuffix>visibility</mat-icon>
        }
      </button>
      @if(handleErrorRegister('confirmPassword', 'required')){
      <mat-error>Confirm Password is required</mat-error>
      } @if(handleErrorRegister('confirmPassword', 'matching')){
      <mat-error>Passwords should match</mat-error>
      }
    </mat-form-field>
    <button style="width: 100%;" mat-fab extended type="submit">
      <mat-icon>person_add</mat-icon>
      Create Account
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
export class SignupComponent {
  fb = inject(NonNullableFormBuilder);
  authService = inject(AuthService);
  userService = inject(UsersService);
  toast = inject(HotToastService);
  router = inject(Router);

  passwordHide = true;
  confirmPasswordHide = true;

  sigupForm = this.fb.group(
    {
      displayName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: Validation.match('password', 'confirmPassword'),
    }
  );

  onSubmit() {
    const { displayName, email, password } = this.sigupForm.value;
    if (!this.sigupForm.valid || !displayName || !email || !password) return;
    console.table(this.sigupForm.value);

    this.authService
      .register({
        email,
        password,
      })
      .pipe(
        switchMap(({ user: { uid } }) =>
          this.userService.addUser({
            uid,
            email,
            displayName,
            role: 'user',
          })
        ),
        this.toast.observe({
          success: 'Congrats! You are all signed up',
          loading: 'Signing up...',
          error: ({ code }) => `${code}`,
        })
      )
      .subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: console.log,
      });
  }

  /* Get errors */
  public handleErrorRegister(controlName: string, errorName: string) {
    return (
      this.sigupForm.get(controlName)?.touched &&
      this.sigupForm.get(controlName)?.errors &&
      this.sigupForm.get(controlName)?.hasError(errorName)
    );
  }
}
