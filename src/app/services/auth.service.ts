import { Injectable, inject } from '@angular/core';
import {
  Auth,
  authState,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  User,
  updatePassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  updateEmail,
} from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { from, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth = inject(Auth);
  firestore = inject(Firestore);
  currentUser$ = authState(this.auth);

  login(credential: { email: string; password: string }) {
    return from(
      signInWithEmailAndPassword(
        this.auth,
        credential.email,
        credential.password
      )
    );
  }

  getCurrentUserUid() {
    return this.auth.currentUser?.uid;
  }

  register(credential: { email: string; password: string }) {
    return from(
      createUserWithEmailAndPassword(
        this.auth,
        credential.email,
        credential.password
      )
    );
  }

  signInWithGoogle() {
    const oAuthProvider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, oAuthProvider));
  }

  logout() {
    return from(signOut(this.auth));
  }

  reauthticateUser(password: string) {
    const credential = EmailAuthProvider.credential(
      this.auth.currentUser!.email!,
      password
    );
    return from(
      reauthenticateWithCredential(this.auth.currentUser!, credential)
    );
  }

  updateUserEmail(user: User, newEmail: string) {
    return from(updateEmail(user, newEmail));
  }

  updateUserPassword(user: User, newPassword: string) {
    return from(updatePassword(user, newPassword));
  }
}
