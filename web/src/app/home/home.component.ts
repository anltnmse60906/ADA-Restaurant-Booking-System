import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, Routes} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  mydate = new Date();

  constructor(private router: Router,
              private routes: ActivatedRoute) {
  }

  ngOnInit() {
  }

  onFindRestaurant() {
    this.router.navigate(['restaurants'], {relativeTo: this.routes})
  }
}
