import { Timestamp } from '@angular/fire/firestore';

export type MenuItem = {
  icon: string;
  label: string;
  route: string;
};
export interface ProfileUser {
  displayName?: string;
  email?: string;
  photoURL?: string;
  phoneNumber?: string;
  role?: string;
  uid: string;
}
export interface Post {
  id?: string;
  title: string;
  content: string;
  authorName: string;
  authorEmail: string;
  visibility: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
