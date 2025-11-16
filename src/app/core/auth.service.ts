import { inject, Injectable } from '@angular/core';
import {
  Auth,
  authState,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  user,
  sendEmailVerification,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from '@angular/fire/auth';
import { Firestore, updateDoc, doc, getDoc, setDoc, collection, getDocs, docData } from '@angular/fire/firestore'
import { distinctUntilChanged, map } from 'rxjs';
import { Environment } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {
    // console.log('Admin emails:', Environment.adminEmails);
  }
  private auth = inject(Auth);
  private db = inject(Firestore);
  user$ = user(this.auth);
  loggedIn$ = this.user$.pipe(map(u =>
     !!u && u.emailVerified),
    distinctUntilChanged()
  );

  async firebaseintializer() {
    this.user$.subscribe(async u => {
      if (u && !Environment.adminEmails.includes(u.email || '')) {
        console.log("ensureuserdoc called for user:", u.uid);

        await this.ensureuserdoc({
          uid: u.uid,
          email: u.email
        });
      }
    });
  }


  async ensureuserdoc(user: { uid: string, email: string | null }) {
    const ref = doc(this.db, 'users', user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        uid: user.uid,
        email: user.email,
        plan: 'free',
        trainer: 'none',
        joinedOn: new Date()
      });
    }
  }
  async getAllUsers(): Promise<Array<{ id: string;[k: string]: any }>> {
    const ref = collection(this.db, 'users');
    const q = await getDocs(ref);
    return q.docs.map(d => ({ id: d.id, ...d.data() }));
  }
  async updateUserData(userid: string, data: any) {
    const ref = doc(this.db, 'users', userid);
    await updateDoc(ref, data);
  }

  isAdmin$ = this.user$.pipe(
    map(u => !!u && Environment.adminEmails.includes(u.email || ''))
  );

  emailSignIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }
  emailSignUp(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }
  resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  googleSignIn() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }
  logout() {
    return signOut(this.auth);
  }

  sendemailverification(user: any = null) {
    if (user) {
      return sendEmailVerification(user);
    }
    return null;
  }

  getuserDoc(uid: string) {
    const ref = doc(this.db, 'users', uid);
    return docData(ref, { idField: 'uid' });
  }




}
