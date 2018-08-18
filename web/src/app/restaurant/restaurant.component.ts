import {Component, OnInit} from '@angular/core';
import {Restaurant} from "../shared/restaurant.model";
import {ActivatedRoute, Router, Routes} from "@angular/router";


@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css']
})
export class RestaurantComponent implements OnInit {

  constructor(private router: Router,
              private routes: ActivatedRoute) {
  }

  ngOnInit() {
  }

  onSelectRestaurant() {
    this.router.navigate(["restaurants"], {relativeTo: this.routes})
  }
}
