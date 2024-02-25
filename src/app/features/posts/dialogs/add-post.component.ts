import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { PostsService } from '../../../services/posts.service';
import { HotToastService } from '@ngneat/hot-toast';
import { UsersService } from '../../../services/users.service';
import { ProfileUser } from '../../../shared/models';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TitleCasePipe } from '@angular/common';
import { serverTimestamp } from '@angular/fire/firestore';

@Component({
  selector: 'post-add',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    TitleCasePipe,
    MatSelectModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-dialog-content>
      <mat-toolbar color="primary" style="border-radius: 10px">
        <h2 mat-dialog-title style="margin-top: -5px;">Add Post</h2>
        <span class="example-spacer"></span>
        <button mat-icon-button [mat-dialog-close]="false">
          <mat-icon>close</mat-icon>
        </button>
      </mat-toolbar>
      <form [formGroup]="addPostForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline">
          <mat-label>Title</mat-label>
          <input matInput type="text" formControlName="title" />
          @if(handleError('title', 'required')){
          <mat-error> Title is Required </mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Visibility</mat-label>
          <mat-select formControlName="visibility" placeholder="Set Visibility">
            @for (val of visibles; track val) {
            <mat-option [value]="val">{{ val | titlecase }}</mat-option>
            }
          </mat-select>
          @if(handleError('visibility', 'required')){
          <mat-error> Visibility is Required </mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Content</mat-label>
          <textarea matInput type="text" formControlName="content"></textarea>
          @if(handleError('content', 'required')){
          <mat-error> Content is Required </mat-error>
          }
        </mat-form-field>
        <button mat-fab extended style="width: 100%;" type="submit">
          Create Post <mat-icon>description</mat-icon>
        </button>
      </form>
    </mat-dialog-content>
  `,
  styles: [
    `
      .example-spacer {
        flex: 1 1 auto;
      }
      mat-toolbar {
        width: 100%;
      }

      mat-form-field {
        width: 100%;
        margin: 2px 0;
      }

      form {
        margin-top: 20px;
        margin-left: 10px;
        margin-right: 10px;
      }
    `,
  ],
})
export class AddPostComponent implements OnInit {
  fb = inject(NonNullableFormBuilder);
  dialogRef = inject(MatDialogRef<AddPostComponent>);
  postsService = inject(PostsService);
  userService = inject(UsersService);
  toast = inject(HotToastService);
  user = signal<ProfileUser | null>(null);

  visibles = ['public', 'private'];

  addPostForm = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
    visibility: ['public', Validators.required],
  });

  ngOnInit(): void {
    this.userService.currentUserProfile$.subscribe((data) => {
      this.user.set(data);
    });
  }

  handleError(controlName: string, errorName: string) {
    return (
      this.addPostForm.get(controlName)?.touched &&
      this.addPostForm.get(controlName)?.errors &&
      this.addPostForm.get(controlName)?.hasError(errorName)
    );
  }

  onSubmit() {
    if (
      !this.addPostForm.valid ||
      !this.addPostForm.value.title ||
      !this.addPostForm.value.content ||
      !this.addPostForm.value.visibility
    )
      return;
    console.table(this.addPostForm.value);
    const { title, content, visibility } = this.addPostForm.value;

    this.postsService
      .addPost({
        title,
        content,
        visibility,
        authorEmail: this.user()?.email!,
        authorName: this.user()?.displayName!,
      })
      .pipe(
        this.toast.observe({
          success: 'Post Submitted Successfully',
          loading: 'Submitting Post...',
          error: ({ code }) => `${code}`,
        })
      )
      .subscribe(() => this.dialogRef.close());
  }
}
