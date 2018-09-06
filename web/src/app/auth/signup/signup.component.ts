import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenService} from "../../services/auth.service";
import {User} from "../../shared/user.model";


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  myForm: FormGroup;

  ngOnInit() {
    this.myForm = new FormGroup({
      email: new FormControl("",
        [Validators.required,
          Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
        ]),
      password: new FormControl("", Validators.required),
      firstName: new FormControl("", Validators.required),
      lastName: new FormControl("", Validators.required),
      phoneNumber: new FormControl("", Validators.required),
    });
  }

  constructor(private authenService: AuthenService) {
  }

  onSubmit() {
    const user = new User(
      this.myForm.value.email,
      this.myForm.value.password,
      this.myForm.value.phoneNumber,
      this.myForm.value.lastName,
      this.myForm.value.firstName,
    );

    // TODO show message when create the account sucessfully
    this.authenService.signUp(user).subscribe(
      (data) => {
        // console.log(data)
      },
      error => console.log(error));
    this.myForm.reset();
  }
}
