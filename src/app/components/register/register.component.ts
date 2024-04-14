import {Router} from "@angular/router";
import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {TranslocoService} from "@jsverse/transloco";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {

  formSignIn: FormGroup;
  error_messages;
  constructor(
    private userService: UserService,
    private router: Router,
    public formBuilder: FormBuilder,
    private translocoService: TranslocoService,
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
    });

    this.error_messages = {
      'email': [
        {type: 'required', message: this.translocoService.translate('register.errorValidMail')},
        {type: 'pattern', message: this.translocoService.translate('register.errorValidMail')},
      ],
      'password': [
        {type: 'required', message: this.translocoService.translate('register.errorPassRequired')},
        {type: 'minlength', message: this.translocoService.translate('register.errorPassShort')},
        {type: 'maxlength', message: this.translocoService.translate('register.errorPassLong')},
      ],
      'password2': [
        {type: 'required', message: this.translocoService.translate('register.errorPass2Required')},
        {type: 'minlength', message: this.translocoService.translate('register.errorPassShort')},
        {type: 'maxlength', message: this.translocoService.translate('register.errorPassLong')},
      ]
    }
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
        if (err.code === 'auth/email-already-in-use') alert(this.translocoService.translate('register.errorEmailInUse'));
        console.log(err);
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

  handleCancel() {
    this.router.navigate(['/login']);
  }
}
