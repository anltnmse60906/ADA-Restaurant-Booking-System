import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenService} from "../../services/auth.service";
import {User} from "../../shared/user.model";
import {SweerAlertService} from '../../dialog-modal/sweet-alert.service';
import {params} from "../../shared/common.params";


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signUpForm: FormGroup;

  ngOnInit() {
    this.signUpForm = new FormGroup({
      email: new FormControl("",
        [Validators.required,
          Validators.pattern(params.emailPattern)
        ]),
      password: new FormControl("", [
        Validators.required,
        Validators.maxLength(300),
        Validators.minLength(6)
      ]),
      firstName: new FormControl("", [Validators.required, Validators.maxLength(300)]),
      lastName: new FormControl("", [Validators.required, Validators.maxLength(300)]),
      phoneNumber: new FormControl("04-", [
        Validators.required,
        Validators.pattern(params.ausPhoneNumberPattern),
      ]),
    });
  }

  constructor(private authenService: AuthenService, private sweetAlertService: SweerAlertService) {
  }

  onSubmit() {
    const user = new User(
      this.signUpForm.value.email,
      this.signUpForm.value.password,
      this.signUpForm.value.phoneNumber,
      this.signUpForm.value.lastName,
      this.signUpForm.value.firstName,
    );

    // TODO show message when create the account sucessfully
    this.authenService.signUp(user).subscribe(
      (data: any) => {
        this.sweetAlertService.okMessage('SignUp Ok', 'User Created');
        this.signUpForm.reset();
      },
      error => {
        console.log(error);
        let message = "Failed to register new account";
        if (error && error.status === 409) {
          message = "Email has been registered";
        }
        this.sweetAlertService.onError('SignUp Error', message);
      });
  }

  get email() {
    return this.signUpForm.get("email");
  }

  get password() {
    return this.signUpForm.get("password");
  }

  get firstName() {
    return this.signUpForm.get("firstName");
  }

  get lastName() {
    return this.signUpForm.get("lastName");
  }

  get phoneNumber() {
    return this.signUpForm.get("phoneNumber");
  }
}
