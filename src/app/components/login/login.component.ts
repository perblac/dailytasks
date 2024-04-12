import {Router} from "@angular/router";
import {Platform} from "@ionic/angular";
import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {TranslocoService} from "@jsverse/transloco";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  formLogIn: FormGroup;

  selectedLang = 'en';

  constructor(
    private userService: UserService,
    private router: Router,
    private platform: Platform,
    private translocoService: TranslocoService,
  ) {
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
  }

  /**
   * Tries to log in a user with email & password
   */
  onSubmit() {
    this.userService.login(this.formLogIn.value)
      .then(res => {
        console.log(res.user);
        this.router.navigate(['/']);
      })
      .catch(err => {
        if (err.code === 'auth/invalid-credential') alert('incorrect email/password');
        console.log('Error en login:',err);
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
        .then(res => {
          console.log('res:', res);
          this.router.navigate(['/']);
        })
        .catch(err => console.log(err));
    } else {
      this.userService.loginWithGoogle()
        .then(res => {
          console.log('res:', res);
          this.router.navigate(['/']);
        })
        .catch(err => console.log(err));
    }
  }

  toggleLang() {
    this.translocoService.setActiveLang(this.selectedLang);
    console.log('lang:', this.translocoService.getActiveLang());
  }

  ionViewWillEnter() {
    this.formLogIn.get('password')?.setValue('');
  }
}
