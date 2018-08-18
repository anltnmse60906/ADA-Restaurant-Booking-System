import { Component, OnInit } from '@angular/core';
import {Restaurant} from "../../shared/restaurant.model";

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  restaurants: Restaurant[] = [
    new Restaurant(1, "Sydney Vegan", "central", ["11:00", "13:00", "15:00", "17:00", "19:00"]),
    new Restaurant(2, "Sydney Meat", "wolli creek", ["11:00", "13:00", "15:00", "17:00", "19:00"]),
    new Restaurant(3, "Sydney Pork", "hurt view", ["11:00", "13:00", "15:00", "17:00", "19:00"]),
    new Restaurant(4, "Sydney Chicken", "paramata", ["11:00", "13:00", "15:00", "17:00", "19:00"]),
    new Restaurant(5, "Sydney Macus", "north sydney", ["11:00", "13:00", "15:00", "17:00", "19:00"]),
  ];

  constructor() { }

  ngOnInit() {
  }

}
