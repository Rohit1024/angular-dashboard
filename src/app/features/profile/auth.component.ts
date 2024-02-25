import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'profile-auth',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatChipsModule,
  ],
  template: `
    <mat-card>
      <mat-card-header
        style="display: flex; flex-direction: column; margin:0 10px;"
      >
        <h1>Authentication</h1>
        <h4>Manage your connected accounts</h4>
      </mat-card-header>
      <mat-card-header
        style="display: flex; flex-direction: column; margin:0 10px;"
      >
        <div>
          <h2>Connected Accounts</h2>
          <h4>These are the accounts linked to your profile</h4>
        </div>
        <mat-chip-set>
          @for (provider of providers(); track $index) { @switch(provider) {
          @case("password"){
          <mat-chip-option selected color="accent">
            Connected with Password</mat-chip-option
          >
          } @case("google.com") {
          <mat-chip-option selected color="accent">
            Connected with Google.com</mat-chip-option
          >
          } @default {
          <mat-chip-option selected color="accent">
            Connected with Anonymously</mat-chip-option
          >
          } } }</mat-chip-set
        >
      </mat-card-header>
      <mat-card-header
        style="display: flex; flex-direction: column; margin:0 10px;"
      >
        <div>
          <h2>Available Providers</h2>
          <h4>
            Click on the providers below to link your profile to the provider
          </h4>
        </div>
        <span style="display: flex; gap: 20px; margin-bottom : 20px;">
          @for(provider of providers(); track $index) { @switch(provider) {
          @case ("google.com") {
          <button mat-fab extended color="primary">
            <mat-icon>mail</mat-icon>
            <span>Connect with Email & Password</span>
          </button>
          } @case ("password") {
          <button mat-fab extended color="primary">
            <mat-icon>person</mat-icon>
            <span>Connect with Google.com</span>
          </button>
          } @default {
          <div>No Providers</div>
          } } }
        </span>
      </mat-card-header>
    </mat-card>
  `,
  styles: ``,
})
export class ProfileAuthComponent implements OnInit {
  providers = signal<string[] | null>(null);

  authService = inject(AuthService);

  getProviders() {
    this.authService.currentUser$.subscribe((userDtail) => {
      if (userDtail) {
        const userInfo = userDtail.providerData;
        let provders = [];
        for (let providerId of userInfo) {
          provders.push(providerId.providerId);
        }
        this.providers.set(provders);
      }
    });
  }

  ngOnInit(): void {
    this.getProviders();
  }
}
