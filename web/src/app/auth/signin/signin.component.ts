import {Router, ActivatedRoute} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from "../../shared/user.model"
import {AuthenService} from "../../services/auth.service";
import {AIPResponse} from "../../shared/response.model";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})

export class SigninComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private route: Router,
    private router: ActivatedRoute,
    private authenService: AuthenService
  ) {
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      password: new FormControl("", Validators.required),
      email: new FormControl("",
        [Validators.required,
          Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
        ]),
    });
  }

  onSubmit(form: any) {
    const user = new User(this.loginForm.value.email, this.loginForm.value.password);
    this.authenService.signIn(user)
      .subscribe(
        (data: Object) => {
          let aipResponse = new AIPResponse().fromJSON(data);
          localStorage.setItem("token", aipResponse.token);
          localStorage.setItem("userId", aipResponse.userId);
          this.route.navigateByUrl('/');
        }, error => {
          console.log(error);
        });
    this.loginForm.reset();
  }


}
