import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { PostsDataSource } from '../../services/posts-dataSource';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { AsyncPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { AddPostComponent } from './dialogs/add-post.component';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    AsyncPipe,
    DatePipe,
    MatMenuModule,
    MatToolbarModule,
    TitleCasePipe,
    MatButtonToggleModule,
  ],
  template: `
    <mat-toolbar style="margin: 10px 0; border-radius: 10px;" color="primary">
      <mat-button-toggle-group
        name="PostSelector"
        #mode="matButtonToggleGroup"
        [value]="['public']"
      >
        <mat-button-toggle value="public">Public</mat-button-toggle>
        <mat-button-toggle value="private">Private</mat-button-toggle>
      </mat-button-toggle-group>
      <span class="example-spacer"></span>
      <button mat-icon-button (click)="addPost()">
        <mat-icon>add</mat-icon>
      </button>
    </mat-toolbar>
    @if(publicDataSource && mode.value === "public") {
    @if(publicDataSource.isLoading$ | async) {
    <span style="display: flex; justify-content : center; align-items : center">
      <mat-icon>hourglass_bottom</mat-icon>
      Loading
    </span>
    } @else {
    <table mat-table [dataSource]="publicDataSource">
      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef>ID</th>
        <td mat-cell *matCellDef="let element; let i = index">{{ i + 1 }}</td>
      </ng-container>
      <ng-container matColumnDef="title">
        <th mat-header-cell *matHeaderCellDef>Title</th>
        <td mat-cell *matCellDef="let element">{{ element.title }}</td>
      </ng-container>
      <ng-container matColumnDef="authorName">
        <th mat-header-cell *matHeaderCellDef>Author Name</th>
        <td mat-cell *matCellDef="let element">{{ element.authorName }}</td>
      </ng-container>
      <ng-container matColumnDef="authorEmail">
        <th mat-header-cell *matHeaderCellDef>Author Email</th>
        <td mat-cell *matCellDef="let element">{{ element.authorEmail }}</td>
      </ng-container>
      <ng-container matColumnDef="updatedAt">
        <th mat-header-cell *matHeaderCellDef>Last Modified</th>
        <td mat-cell *matCellDef="let element">
          {{ element.updatedAt.toDate() | date }}
        </td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let element">
          <button mat-icon-button color="primary" [matMenuTriggerFor]="menu">
            <mat-icon>more_vert</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="publicColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: publicColumns"></tr>
    </table>
    } } @else if(privateDataSource && mode.value === "private"){
    @if(privateDataSource.isLoading$ | async) {
    <span style="display: flex; justify-content : center; align-items : center">
      <mat-icon>hourglass_bottom</mat-icon>
      Loading
    </span>
    } @else {
    <table mat-table [dataSource]="privateDataSource">
      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef>ID</th>
        <td mat-cell *matCellDef="let element; let i = index">{{ i + 1 }}</td>
      </ng-container>
      <ng-container matColumnDef="title">
        <th mat-header-cell *matHeaderCellDef>Title</th>
        <td mat-cell *matCellDef="let element">{{ element.title }}</td>
      </ng-container>
      <ng-container matColumnDef="authorName">
        <th mat-header-cell *matHeaderCellDef>Author Name</th>
        <td mat-cell *matCellDef="let element">{{ element.authorName }}</td>
      </ng-container>
      <ng-container matColumnDef="visibility">
        <th mat-header-cell *matHeaderCellDef>Visibility</th>
        <td mat-cell *matCellDef="let element">
          {{ element.visibility | titlecase }}
        </td>
      </ng-container>
      <ng-container matColumnDef="updatedAt">
        <th mat-header-cell *matHeaderCellDef>Last Modified</th>
        <td mat-cell *matCellDef="let element">
          {{ element.updatedAt.toDate() | date }}
        </td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let element">
          <button mat-icon-button color="primary" [matMenuTriggerFor]="menu">
            <mat-icon>more_vert</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="privateColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: privateColumns"></tr>
    </table>
    } } @else {
    <span>No Posts Found</span>
    }

    <mat-menu #menu="matMenu">
      <button mat-menu-item><mat-icon>visibility</mat-icon>View</button>
      <button mat-menu-item><mat-icon>delete</mat-icon>Delete</button>
    </mat-menu>
  `,
  styles: [
    `
      .example-spacer {
        flex: 1 1 auto;
      }

      mat-button-toggle-group {
        border-radius: 30px;
      }

      table {
        border-radius: 10px;
      }
    `,
  ],
})
export class PostsComponent implements OnInit, AfterViewInit {
  mat_dialog = inject(MatDialog);
  publicColumns = [
    'id',
    'title',
    'authorName',
    'authorEmail',
    'updatedAt',
    'actions',
  ];

  privateColumns = [
    'id',
    'title',
    'authorName',
    'visibility',
    'updatedAt',
    'actions',
  ];

  publicDataSource = new PostsDataSource();
  privateDataSource = new PostsDataSource();

  ngAfterViewInit(): void {
    this.publicDataSource.loadPublicPosts();
    this.privateDataSource.loadPrivatePosts();
  }

  ngOnInit(): void {
    this.publicDataSource.loadPublicPosts();
    this.privateDataSource.loadPrivatePosts();
  }

  addPost() {
    this.mat_dialog
      .open(AddPostComponent, {
        disableClose: true,
      })
      .afterClosed()
      .subscribe((value) => {
        console.log(value);
        if (value) this.publicDataSource.loadPublicPosts();
      });
  }
}
