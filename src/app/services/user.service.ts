import {Injectable} from '@angular/core';
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

  constructor(
    private auth: Auth
  ) {
    GoogleAuth.initialize();
  }

  /**
   * Register a user with email & password
   * @param email email to register
   * @param password password to register
   */
  register({email, password}: any) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * Login a user using email & password
   * @param email email of the user
   * @param password password of the user
   */
  login({email, password}: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * Login using Google in web
   */
  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  /**
   * Login using Google in mobile device
   */
  async loginWithGoogleMobile() {
    const googleUser = await GoogleAuth.signIn();
    const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
    return signInWithCredential(this.auth, credential);
  }

  logout() {
    return signOut(this.auth);
  }

  logoutMobile() {
    return GoogleAuth.signOut();
  }

}
