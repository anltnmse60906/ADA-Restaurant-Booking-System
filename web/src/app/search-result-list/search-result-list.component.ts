import {Component, OnInit} from '@angular/core';
import {Restaurant} from "../shared/restaurant.model";


@Component({
  selector: 'app-search-result-list',
  templateUrl: './search-result-list.component.html',
  styleUrls: ['./search-result-list.component.css']
})
export class SearchResultListComponent implements OnInit {
  restaurants: Restaurant[] = [
    new Restaurant("Sydney Vegan", "central", ["11:00", "13:00", "15:00", "17:00", "19:00"]),
    new Restaurant("Sydney Meat", "wolli creek", ["11:00", "13:00", "15:00", "17:00", "19:00"]),
    new Restaurant("Sydney Pork", "hurt view", ["11:00", "13:00", "15:00", "17:00", "19:00"]),
    new Restaurant("Sydney Chicken", "paramata", ["11:00", "13:00", "15:00", "17:00", "19:00"]),
    new Restaurant("Sydney Macus", "north sydney", ["11:00", "13:00", "15:00", "17:00", "19:00"]),
  ];

  constructor() {
  }

  ngOnInit() {
  }

}
