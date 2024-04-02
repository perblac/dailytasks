import {inject, Injectable, OnDestroy} from '@angular/core';
import {
  Auth,
  getAuth,
  User,
  user,
  authState,
  idToken,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "@angular/fire/auth";
import {Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private auth: Auth = inject(Auth);
  user$ = user(getAuth());
  userSubscription: Subscription;
  authState$ = authState(this.auth);
  authStateSubscription: Subscription;
  idToken$ = idToken(this.auth);
  idTokenSubscription: Subscription;

  private userUid = '';

  constructor() {
    this.userSubscription = this.user$.subscribe((aUser: User | null) => {
      console.log('user subscription:', aUser);
      this.userUid = aUser?.uid ?? '';
      console.log(this.userUid);
    });
    this.authStateSubscription = this.authState$.subscribe((aUser: User | null) => {
      console.log('auth subscription', aUser);
    });
    this.idTokenSubscription = this.idToken$.subscribe((token: string | null) => {
      console.log('token subscription', token);
    });
  }

  async login() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    signInWithPopup(this.auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log('Code:',errorCode,'msg:',errorMessage,'user email:',email,'credential',credential);
      });
  }

  logout() {
    signOut(this.auth).then(()=> {
      console.log('signOut');
    }).catch(err => console.log(err));
  }

  getUserUid() {
    return this.userUid;
  }
  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.authStateSubscription.unsubscribe();
    this.idTokenSubscription.unsubscribe();
  }
}
