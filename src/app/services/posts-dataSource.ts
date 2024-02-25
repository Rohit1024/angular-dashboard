import { DataSource } from '@angular/cdk/collections';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Post } from '../shared/models';
import { PostsService } from './posts.service';

@Injectable()
export class PostsDataSource extends DataSource<Post> {
  postService = inject(PostsService);

  posts$ = new BehaviorSubject<Post[]>([]);
  isLoading$ = new BehaviorSubject<boolean>(false);

  connect(): Observable<Post[]> {
    return this.posts$.asObservable();
  }

  disconnect(): void {
    this.posts$.complete();
  }

  loadPublicPosts(): void {
    this.isLoading$.next(true);
    this.postService.getAllPublicPosts().subscribe((posts) => {
      this.posts$.next(posts);
      this.isLoading$.next(false);
    });
  }

  loadPrivatePosts(): void {
    this.isLoading$.next(true);
    this.postService.getPrivatePosts().subscribe((posts) => {
      this.posts$.next(posts);
      this.isLoading$.next(false);
    });
  }
}
