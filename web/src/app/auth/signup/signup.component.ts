import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthenService } from "../../services/auth.service";
import { User } from "../../shared/user.model";
import { SweerAlertService } from '../../sweet-alert.service';
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
      password: new FormControl("", Validators.required),
      firstName: new FormControl("", Validators.required),
      lastName: new FormControl("", Validators.required),
      phoneNumber: new FormControl("04-", [
        Validators.required,
        Validators.pattern("^04\-[0-9]{8}$"),
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
        if (data.error) {
          if(data.error == "existing_user")
            this.sweetAlertService.onError('SignUp Error', data.title);
        } else {
          this.sweetAlertService.okMessage('SignUp Ok', 'User Created');
        }
      },
      error => {

      });
    this.signUpForm.reset();
  }

  get email(){
    return this.signUpForm.get("email");
  }
  get password(){
    return this.signUpForm.get("password");
  }
  get firstName(){
    return this.signUpForm.get("firstName");
  }
  get lastName(){
    return this.signUpForm.get("lastName");
  }
  get phoneNumber(){
    return this.signUpForm.get("phoneNumber");
  }
}
