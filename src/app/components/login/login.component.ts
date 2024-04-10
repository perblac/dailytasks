import {Router} from "@angular/router";
import {Platform} from "@ionic/angular";
import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  formLogIn: FormGroup;

  constructor(
    private userService: UserService,
    private router: Router,
    private platform: Platform,
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
        console.log(err);
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

  ionViewWillEnter() {
    this.formLogIn.get('password')?.setValue('');
  }
}
