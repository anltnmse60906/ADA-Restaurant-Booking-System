import {Component, Input, OnInit} from '@angular/core';
import {TableService} from "../../services/table.service";
import {Table} from "../../shared/table.model";

@Component({
  selector: 'app-booking-history-element',
  templateUrl: './booking-history-element.component.html',
  styleUrls: ['./booking-history-element.component.css']
})
export class BookingHistoryElementComponent implements OnInit {
  @Input() bookings: Object[] = [];
  private booking = {};

  constructor(private tableService: TableService) {
  }

  ngOnInit() {
    if (this.bookings && this.bookings.length != 0) {
      this.booking = this.bookings[0];
    }
  }

  sectionNumberToCategorial(section: number) {
    return this.tableService.sectionNumberToCategorical(section);
  }

  getMaximumPeople() {
    if (this.bookings && this.bookings.length != 0) {
      this.booking = this.bookings[0];
      let total = 0;
      for (let t of this.bookings) {
        total += t['tableId'].capacity;
      }
      return total;
    }
    return 0;
  }
}
