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
import {Capacitor} from "@capacitor/core";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  clientId: string = '';

  constructor(
    private auth: Auth
  ) {
    if (!environment.production) console.log('userService created');
    const platform = Capacitor.getPlatform();
    this.clientId = (platform === 'android') ?
      "334552631074-p1ek35mnsjaa3ptq524od78rnq0vqhe5.apps.googleusercontent.com" :
      "334552631074-26thlrv58vbo6gmt26b8lkqgbmghi520.apps.googleusercontent.com" ;
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
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    return signInWithPopup(this.auth, provider);
  }

  /**
   * Login using Google in mobile device
   */
  async loginWithGoogleMobile() {
    try {
      await GoogleAuth.initialize({clientId: this.clientId});
      if (!environment.production) console.log('googleAuth.initialized');
      const googleUser = await GoogleAuth.signIn();
      if (!environment.production) console.log('googleUser:',googleUser);
      const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
      if (!environment.production) console.log('google credential:', credential);
      return signInWithCredential(this.auth, credential);
    } catch (err) {
      if (!environment.production) console.log('loginWithGoogleMobile error:', err);
      throw err;
    }
  }

  logout() {
    return signOut(this.auth);
  }

  logoutMobile() {
    return GoogleAuth.signOut().then(() => signOut(this.auth));
  }

}
