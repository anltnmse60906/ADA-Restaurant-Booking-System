import {Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {TableService} from "../services/table.service";

@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.css', "../home/home.component.css"]
})
export class BookingHistoryComponent implements OnInit {
  meals = [];
  // asyncMeals: Observable<any>;
  p: number = 1;
  total: number;
  loading: boolean;


  constructor(
    private tableService: TableService
  ) {
  }

  ngOnInit() {
    this.getPage(1);
  }

  getPage(page: number) {
    this.loading = true;
    const queryParam = "p=" + page;
    this.tableService.getBookingHistory(queryParam).subscribe(response => {
      this.total = response["obj"].total;
      this.loading = false;
      this.p = response["obj"].page;
      this.meals = response["obj"].bookings;

    });

  }
}
