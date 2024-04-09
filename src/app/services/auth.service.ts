import { inject, Injectable, OnDestroy } from '@angular/core';
import {
  Auth,
  getAuth,
  User,
  user,
  authState,
  idToken,
} from "@angular/fire/auth";
import { Subscription } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private auth: Auth = inject(Auth);
  user$ = user(getAuth());
  userSubscription: Subscription;
  authState$ = authState(this.auth);
  idToken$ = idToken(this.auth);

  private userUid = '';

  constructor() {
    this.userSubscription = this.user$.subscribe((aUser: User | null) => {
      console.log('user subscription:', aUser);
      this.userUid = aUser?.uid ?? '';
      console.log('uid:', this.userUid);
    });
  }

  getUserUid() {
    return this.userUid;
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
