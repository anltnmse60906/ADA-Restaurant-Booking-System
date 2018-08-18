import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {Restaurant} from "../../../shared/restaurant.model";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-search-result-detail',
  templateUrl: './search-result-detail.component.html',
  styleUrls: ['./search-result-detail.component.css']
})
export class SearchResultDetailComponent implements OnInit {
  @Input("RestaurantDetail") restaurant: Restaurant;

  constructor(private routes: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
  }

  onItemClick(resturant: Restaurant) {
    this.router.navigate(['/restaurants',resturant.id])
  }
}
