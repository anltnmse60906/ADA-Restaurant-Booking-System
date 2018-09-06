import {Component, OnInit} from '@angular/core';
import {AuthenService} from "../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-web-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private authenService: AuthenService, private router: Router, private routes: ActivatedRoute) {
  }

  ngOnInit() {
  }

  isLoggedIn() {
    return this.authenService.isLoggedIn();
  }

  onLogout() {
    this.authenService.logOut();
    this.router.navigateByUrl("/");
  }

  getUserDisplayName() {

  }
}
