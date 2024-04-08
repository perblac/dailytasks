import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {
  formLogIn: FormGroup;
  constructor(
    private userService: UserService,
    private router: Router,
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
    })
  }

  ngOnInit() {}

  onSubmit() {
    this.userService.login(this.formLogIn.value)
      .then( res => {
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

  onClickLoginWithGoogle() {
    this.userService.loginWithGoogle()
      .then(res => {
        console.log(res);
        this.router.navigate(['/']);
      })
      .catch(err => console.log(err));
  }

  ionViewWillEnter() {
    this.formLogIn.get('password')?.setValue('');
  }
}
