// import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  @ViewChild('loginForm') public formLogin: NgForm;

  constructor(
    private route: Router,
    private router: ActivatedRoute,
  ) { }

  ngOnInit() {
  }
  onSubmit (form: any) {
    this.route.navigate(['/main'], {relativeTo: this.router})
  }

}
