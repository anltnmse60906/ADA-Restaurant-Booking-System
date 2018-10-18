import {Router, ActivatedRoute} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from "../../shared/user.model"
import {AuthenService} from "../../services/auth.service";
import {params} from "../../shared/common.params";
import {SweerAlertService} from '../../dialog-modal/sweet-alert.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})

export class SigninComponent implements OnInit {
  loginForm: FormGroup;
  returnUrl: string = "";

  constructor(
    private router: Router,
    private routes: ActivatedRoute,
    private authenService: AuthenService,
    private sweetAlertService: SweerAlertService
  ) {
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      password: new FormControl("",
        [
          Validators.required,
          Validators.maxLength(300),
          Validators.minLength(6),
        ]),
      email: new FormControl("",
        [Validators.required,
          Validators.pattern(params.emailPattern)
        ]),
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.routes.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit(form: any) {
    const user = new User(this.loginForm.value.email, this.loginForm.value.password);
    this.authenService.signIn(user)
      .subscribe(
        (data) => {
          this.loginForm.reset();
          this.sweetAlertService.okMessage("Login", "Login success");
          localStorage.setItem("token", data["token"]);
          localStorage.setItem("userId", data["userId"]);
          localStorage.setItem("lastName", data["lastName"]);
          localStorage.setItem("firstName", data["firstName"]);
          this.router.navigateByUrl(this.returnUrl);
        }, error => {
          console.log(error);
          this.sweetAlertService.onError('Sign-in Error', "Failed to sign in");
        });
  }


  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
