import {inject, Injectable, OnDestroy} from '@angular/core';
import {
  Auth,
  getAuth,
  User,
  user,
  authState,
  idToken,
} from "@angular/fire/auth";
import {Subscription} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private auth: Auth = inject(Auth);
  user$ = user(this.auth);
  userSubscription: Subscription;
  authState$ = authState(this.auth);
  idToken$ = idToken(this.auth);

  private userUid = '';

  constructor() {
    if (!environment.production) console.log('authService created');
    this.userSubscription = this.user$.subscribe((aUser: User | null) => {
      if (!environment.production) console.log('user subscription:', aUser);
      this.userUid = aUser?.uid ?? '';
      if (!environment.production) console.log('uid:', this.userUid);
    });
  }

  /**
   * Returns current user uid
   */
  getUserUid() {
    return this.userUid;
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
