import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  docData,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  collectionGroup,
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { Post } from '../shared/models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  firestore = inject(Firestore);
  authService = inject(AuthService);
  privatePostsRef = collection(
    this.firestore,
    'users',
    `${this.authService.getCurrentUserUid()}`,
    'posts'
  );

  allPostsRef = query(
    collectionGroup(this.firestore, 'posts'),
    where('visibility', '==', 'public')
  );

  getAllPublicPosts() {
    return collectionData(this.allPostsRef, {
      idField: 'id',
    }) as Observable<Post[]>;
  }

  getPrivatePosts() {
    return collectionData(this.privatePostsRef, {
      idField: 'id',
    }) as Observable<Post[]>;
  }

  getPost(id: string) {
    return docData(
      doc(
        this.firestore,
        'users',
        `${this.authService.getCurrentUserUid()}`,
        'posts',
        id
      ),
      {
        idField: 'id',
      }
    ) as Observable<Post>;
  }

  addPost(post: Post) {
    return from(
      addDoc(this.privatePostsRef, {
        ...post,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    );
  }

  editPost(post: Post) {
    return from(
      updateDoc(
        doc(
          this.firestore,
          'users',
          `${this.authService.getCurrentUserUid()}`,
          'posts',
          post.id!
        ),
        {
          ...post,
          updatedAt: serverTimestamp(),
        }
      )
    );
  }

  removePost(id: string) {
    return from(
      deleteDoc(
        doc(
          this.firestore,
          'users',
          `${this.authService.getCurrentUserUid()}`,
          'posts',
          id
        )
      )
    );
  }
}
