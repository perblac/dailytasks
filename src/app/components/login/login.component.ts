import {Router} from "@angular/router";
import {IonRouterOutlet, Platform} from "@ionic/angular";
import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {getBrowserLang, TranslocoService} from "@jsverse/transloco";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  formLogIn: FormGroup;

  selectedLang: string = 'en';

  googleIcon = 'assets/icon/googleicon.svg';

  version = environment.version;

  constructor(
    private userService: UserService,
    private router: Router,
    private routerOutlet: IonRouterOutlet,
    private platform: Platform,
    private translocoService: TranslocoService,
  ) {
    console.log('login created');
    this.formLogIn = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
    });

    // When loading to login, get default language from browser
    if (this.routerOutlet.getLastUrl() !== '/list-tasks') {
      let defaultLang = getBrowserLang() || 'en';
      defaultLang = (['en', 'es', 'fr', 'de', 'ru'].includes(defaultLang)) ? defaultLang : 'en';
      console.log('browser lang:', getBrowserLang(), 'defLang:', defaultLang);
      this.translocoService.setActiveLang(defaultLang);
      this.selectedLang = defaultLang;
    }
    // When loading from logout, get active language
    if (this.routerOutlet.getLastUrl() === '/list-tasks') {
      const lang: string = this.translocoService.getActiveLang();
      this.translocoService.setActiveLang(lang);
      this.selectedLang = lang;
    }
  }

  /**
   * Tries to log in a user with email & password
   */
  onSubmit() {
    this.userService.login(this.formLogIn.value)
      .then(() => this.router.navigate(['/']))
      .catch(err => {
        if (err.code === 'auth/invalid-credential') alert(this.translocoService.translate('login.failMessage'));
        console.log('Error en login:', err);
      });
  }

  onClickNavigateToRegister() {
    this.router.navigate(['/register']);
  }

  /**
   * Opens login with Google
   */
  onClickLoginWithGoogle() {
    if (this.platform.is('hybrid')) {
      this.userService.loginWithGoogleMobile()
        .then(() => this.router.navigate(['/']))
        .catch(err => console.log(err));
    } else {
      this.userService.loginWithGoogle()
        .then(() => this.router.navigate(['/']))
        .catch(err => console.log(err));
    }
  }

  toggleLang(event: any = null) {
    if (event) {
      const lang = event.detail.value;
      this.translocoService.setActiveLang(lang);
      this.selectedLang = lang;
      console.log('lang:', lang);
    }
  }

  ionViewWillEnter() {
    // Reset password field and get dark mode from browser
    this.formLogIn.get('password')?.setValue('');
    const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.body.classList.toggle('dark', darkMode);
  }
}
