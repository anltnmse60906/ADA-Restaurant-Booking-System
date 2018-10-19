import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {TableService} from "../services/table.service";
import {Table} from "../shared/table.model";
import {NgbActiveModal, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.css', "../home/home.component.css"]
})
export class BookingHistoryComponent implements OnInit {
  meals = [];
  p: number = 1;
  total: number;
  loading: boolean;
  currentBooking: object;

  @ViewChild('historyModal') private content;


  constructor(
    private tableService: TableService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {
    this.getPage(1);

    this.tableService.openHistoryBookingModel.subscribe((booking) => {
      this.currentBooking = booking;
      this.modalService.open(this.content,{ size: 'lg' });

    })
  }
  sectionNumberToCategorial(section: number) {
    return this.tableService.sectionNumberToCategorical(section);
  }
  // Paging
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
