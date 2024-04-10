import {Router} from "@angular/router";
import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {

  formSignIn: FormGroup;

  error_messages = {
    'email': [
      {type: 'required', message: 'A valid email is required.'},
      {type: 'pattern', message: 'A valid email is required.'},
    ],
    'password': [
      {type: 'required', message: 'A password is required.'},
      {type: 'minlength', message: 'Password too short. Minimum 6 characters.'},
      {type: 'maxlength', message: 'Password too long. Maximum 30 characters.'},
    ],
    'password2': [
      {type: 'required', message: 'Repeating the password is required.'},
      {type: 'minlength', message: 'Password too short. Minimum 6 characters.'},
      {type: 'maxlength', message: 'Password too long. Maximum 30 characters.'},
    ]
  }

  constructor(
    private userService: UserService,
    private router: Router,
    public formBuilder: FormBuilder,
  ) {
    this.formSignIn = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      password2: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30)
      ]),
    }, {
      validators: this.passwordsMatch.bind(this)
    })
  }

  /**
   * Registers a new user. If successful, redirects to login page
   */
  onSubmit() {
    this.userService.register(this.formSignIn.value)
      .then(res => {
        console.log('user cred:', res);
        this.router.navigate(['/login']);
      })
      .catch(err => {
        if (err.code === 'auth/email-already-in-use') alert('Email already registered');
        console.log(err)
      });
  }

  /**
   * Validator for password matching in formGroup
   * @param formGroup FormGroup with fields password & password2 to check for matching
   */
  passwordsMatch(formGroup: FormGroup) {
    const {value: password} = formGroup.get('password')!;
    const {value: password2} = formGroup.get('password2')!;
    return password2 === password ? null : {passwordNotMatch: true}
  }
}
