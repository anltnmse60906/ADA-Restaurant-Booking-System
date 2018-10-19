import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
      let tablesNumber = [];
      for (let t of this.bookings) {
        total += t['tableId'].capacity;
        tablesNumber.push(t['tableId'].name)
      }
      this.booking["bookingTables"] = tablesNumber;
      this.booking["totalPeople"] = total;
      return total;
    }
    return 0;
  }

  orderDetail(){
    this.tableService.openHistoryBookingModel.emit(this.booking);
  }
}
