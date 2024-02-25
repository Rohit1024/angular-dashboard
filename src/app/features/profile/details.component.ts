import { Component, inject, signal } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { switchMap } from 'rxjs';
import { HotToastService } from '@ngneat/hot-toast';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { ProfileUser } from '../../shared/models';

@Component({
  selector: 'settingd-profile',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    RouterLink,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <div class="profile-image">
          <img
            width="120"
            height="120"
            class="margin-top mat-elevation-z1"
            [src]="user()?.photoURL ?? '/assets/image-placeholder.png'"
          />
          <button mat-mini-fab (click)="inputField.click()">
            <mat-icon>edit</mat-icon>
          </button>
        </div>
        <input
          #inputField
          hidden
          type="file"
          (change)="uploadImage($event, user()!)"
        />
      </mat-card-header>
      <mat-card-content>
        <form
          style="margin-top:30px;"
          [formGroup]="updateDetailsForm"
          (ngSubmit)="onSubmit()"
        >
          <mat-form-field appearance="outline">
            <mat-label>Display Name</mat-label>
            <input matInput formControlName="displayName" />
            <mat-icon matPrefix>person</mat-icon>
            <mat-error></mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>

            <mat-icon matPrefix>mail</mat-icon>
            <input matInput formControlName="email" />

            <a
              matSuffix
              mat-icon-button
              routerLink="/settings/profile/email"
              type="button"
              matTooltip="Update Email Address ?"
              [matTooltipPosition]="'left'"
            >
              <mat-icon>info</mat-icon>
            </a>
            <mat-error></mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Phone Number</mat-label>
            <input matInput formControlName="phoneNumber" />
            <mat-icon matPrefix>phone</mat-icon>
            <mat-error></mat-error>
          </mat-form-field>
          <mat-card-actions>
            <button style="width: 100%;" mat-fab extended color="primary">
              <mat-icon>person</mat-icon> Update Profile Details
            </button>
          </mat-card-actions>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .profile-image {
        position: relative;
        width: 120px;
        margin: auto;
      }

      .profile-image > img {
        border-radius: 100%;
        object-fit: cover;
        object-position: center;
      }

      .profile-image > button {
        position: absolute;
        bottom: 5px;
        right: 0;
      }

      mat-form-field {
        width: 100%;
      }
    `,
  ],
})
export class ProfileDetailsComponent {
  user = signal<ProfileUser | null>(null);
  fb = inject(NonNullableFormBuilder);
  userService = inject(UsersService);
  toast = inject(HotToastService);

  ngOnInit(): void {
    this.setUserSignal();
  }

  setUserSignal() {
    this.userService.currentUserProfile$.subscribe((data) => {
      if (data) this.user.set(data);
      this.updateDetailsForm.patchValue({ ...data });
    });
  }

  updateDetailsForm = this.fb.group({
    uid: [''],
    email: [{ value: 'Nancy', disabled: true }],
    displayName: ['', [Validators.required, Validators.minLength(3)]],
    phoneNumber: [''],
  });

  uploadImage(event: any, { uid }: ProfileUser) {
    this.userService
      .uploadImage(event.target.files[0], `images/profile/${this.user()?.uid}`)
      .pipe(
        this.toast.observe({
          loading: 'Uploading profile image...',
          success: 'Image uploaded successfully',
          error: 'There was an error in uploading the image',
        }),
        switchMap((photoURL) =>
          this.userService.updateUser({
            uid,
            photoURL,
          })
        )
      )
      .subscribe();
  }

  onSubmit() {
    const { uid, displayName, phoneNumber } = this.updateDetailsForm.value;
    if (!this.updateDetailsForm.valid || !displayName || !uid) return;
    this.userService
      .updateUser({
        uid,
        displayName,
        phoneNumber,
      })
      .pipe(
        this.toast.observe({
          success: 'Profile Updated Successfully',
          loading: 'Loading...',
          error: 'Something went Wrong',
        })
      )
      .subscribe({
        error: console.log,
      });
  }
}
