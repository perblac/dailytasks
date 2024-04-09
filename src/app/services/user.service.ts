import {Injectable, OnInit} from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  signInWithCredential,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
} from "@angular/fire/auth";
import {GoogleAuth} from "@codetrix-studio/capacitor-google-auth";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private auth: Auth) {
    GoogleAuth.initialize();
  }

  register({email, password}:any) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login({email, password}: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  async loginWithGoogleMobile() {
    const googleUser = await GoogleAuth.signIn();
    const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
    return signInWithCredential(this.auth, credential);
  }

  logout(){
    return signOut(this.auth);
  }

  logoutMobile() {
    return GoogleAuth.signOut();
  }

}
