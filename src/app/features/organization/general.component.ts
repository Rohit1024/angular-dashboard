import { Component, inject } from '@angular/core';
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

@Component({
  selector: 'setting-organization',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <mat-card>
      <mat-card-header
        style="display: flex; flex-direction: column; margin:0 10px;"
      >
        <h1>General</h1>
        <h4>Manage your Organization</h4>
      </mat-card-header>
      <mat-card-content>
        <form
          style="margin:0 10px;"
          [formGroup]="orgForm"
          (ngSubmit)="onSubmit()"
        >
          <mat-form-field appearance="outline">
            <mat-label>Organization Name</mat-label>
            <input
              matInput
              placeholder="Organization Name"
              formControlName="orgName"
            />
            <mat-icon matPrefix>account_balance</mat-icon>
            <mat-error></mat-error>
          </mat-form-field>
          <mat-card-actions>
            <button style="width: 100%;" mat-fab extended="" color="primary">
              <mat-icon>account_balance</mat-icon> Update Organization
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
export class OrganizationGeneralComponent {
  fb = inject(NonNullableFormBuilder);
  orgForm = this.fb.group({
    orgName: ['', Validators.required],
  });

  onSubmit() {}
}
