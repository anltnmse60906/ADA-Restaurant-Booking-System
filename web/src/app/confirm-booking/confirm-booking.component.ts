import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbModal, NgbCalendar, NgbModalConfig,} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, Router} from "@angular/router";
import {TableService} from "../services/table.service";
import {DatePipe} from "@angular/common";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {interval, Subscription} from "rxjs";
import {map} from "rxjs/operators";
import {ComponentCanDeactivate} from "../shared/component-can-deactivate";
import {params} from "../shared/common.params";

@Component({
  selector: 'app-confirm-booking',
  templateUrl: './confirm-booking.component.html',
  styleUrls: ['./confirm-booking.component.css'],
  providers: [DatePipe]
})


export class ConfirmBookingComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  selectedTables: BookingForTable[] = [];
  confirmBookingForm: FormGroup;
  bookingSuccess = false;
  subscription: Subscription;
  expiredTime: Date;
  diff: number;
  minute: number;
  second: number;
  message = "";
  waitForConfirm = true;
  modalIsShow: boolean = false;
  confirmSuccess: boolean = false;

  constructor(private modalService: NgbModal,
              private ngbModalConfig: NgbModalConfig,
              private calendar: NgbCalendar,
              private router: Router,
              private tableService: TableService,
  ) {
    ngbModalConfig.backdrop = "static";
    ngbModalConfig.keyboard = false;

  }

  canDeactivate(): boolean {
    return !this.modalIsShow;
  }

  unloadNotification($event: any): boolean {
    return undefined;
  }


  showingMessage(): string {
    return "If you leave, your reserved tables will be canceled!!!";
  }

  callback(): void {
    this.cancelAllBookingTable(function () {
      console.log("The tables have been deleted");
    });
  }


  ngOnInit() {
    this.expiredTime = new Date();
    this.expiredTime.setMinutes(this.expiredTime.getMinutes() + 10);
    // this.expiredTime.setSeconds(this.expiredTime.getSeconds() + 10);

    //initialise the timer for 10 minutes
    this.subscription = interval(1000).pipe(map((x) => {
      this.diff = Math.abs(this.expiredTime.getTime() - new Date().getTime());
    })).subscribe((x) => {
      this.minute = this.getMinutes(this.diff);
      this.second = this.getSeconds(this.diff);

      // subscribe method when the time is up
      if (this.minute === 0 && this.second === 0 || (this.expiredTime.getTime() - new Date().getTime()) <= 0) {
        this.waitForConfirm = false;
        this.onReservedBookingExpired();
      }
    });

    // call to back-end to get the current reserved booking from this current user
    if (localStorage.getItem("selectedSection") && localStorage.getItem("selectedBookingDay")) {
      this.tableService.getReservedTableByUser(localStorage.getItem("selectedSection"), localStorage.getItem("selectedBookingDay"))
        .subscribe((response) => {
          let bookings = response["obj"].reservedTable;
          let user = response["obj"].user;

          if (bookings && bookings.length > 0) {
            // Set selected tables
            for (let booking of bookings) {
              this.selectedTables.push(new BookingForTable(booking._id, booking.tableId.name));
            }
            //Set user information to the form
            this.confirmBookingForm.get("email").setValue(user.email);
            this.confirmBookingForm.get("lastName").setValue(user.lastName);
            this.confirmBookingForm.get("firstName").setValue(user.firstName);
            this.confirmBookingForm.get("phoneNumber").setValue(user.phoneNumber);
          } else {
            //return to the home page when error occurred.
            this.returnToHomePage();
          }
        });
    } else {
      this.returnToHomePage();
    }

    //Initialise validation form
    this.confirmBookingForm = new FormGroup({
      email: new FormControl("",
        [Validators.required,
          Validators.pattern(params.emailPattern),
          Validators.maxLength(300),
        ]),
      lastName: new FormControl("", [Validators.required,Validators.maxLength(300),]),
      firstName: new FormControl("", [Validators.required, Validators.maxLength(300),]),
      phoneNumber: new FormControl("04-", [
        Validators.required,
        Validators.pattern(params.ausPhoneNumberPattern),
      ]),
      requirement: new FormControl("", [Validators.maxLength(500)]),
    })

  }

  ngOnDestroy(): void {
    console.log("onDetroy of confirm booking called");
    this.subscription.unsubscribe()
  }

  getBookingDate() {
    if (localStorage.getItem("selectedBookingDay")) {
      return localStorage.getItem("selectedBookingDay");
    }
  }

  getSection() {
    if (localStorage.getItem("selectedSection")) {
      let s = parseInt(localStorage.getItem("selectedSection"));
      if (s === 1) {
        return "Breakfast";
      } else if (s === 2) {
        return "Lunch";
      } else if (s === 3) {
        return "Dinner";
      }
    }
    return ""
  }

  getPeople() {
    return (localStorage.getItem("max-people")) ? localStorage.getItem("max-people") : "";
  }

  // This method is called when confirm booking
  onSubmitConfirmBooking() {
    this.subscription.unsubscribe();

    // Prepare data for submit
    let reservedBookings = [];
    for (let t of this.selectedTables) {
      let data = {
        lastName: this.confirmBookingForm.value.lastName,
        firstName: this.confirmBookingForm.value.firstName,
        email: this.confirmBookingForm.value.email,
        phoneNumber: this.confirmBookingForm.value.phoneNumber,
        requirement: this.confirmBookingForm.value.requirement,
        bookingId: t._id,
      };
      reservedBookings.push(data);
    }

    // submit to server
    this.tableService.confirmBooking("", {reservedBookings: reservedBookings}).subscribe((response) => {
      console.log(response);
      let success = response['obj'].success;

      // Show message when success
      if (success) {
        this.bookingSuccess = true;
        this.waitForConfirm = false;
        this.confirmSuccess = true;
        this.modalIsShow = true;
        this.confirmBookingForm.disable();
      } else {
        //show error message because of the bookings are expired and return to home page
        this.onReservedBookingExpired();
      }
    });
  }

  cancelAllBookingTable(callback) {
    if (this.selectedTables) {
      let count = 0;
      for (let t of this.selectedTables) {
        let obj = {
          bookingId: t._id
        };
        count++;
        this.tableService.deleteReservedTable("", obj).subscribe((response) => {
          console.log(response);
          if (count === this.selectedTables.length) {
            callback();
          }
        })
      }
    }
  }

  onCancelAllBookingTable() {
    this.modalIsShow = false;
    this.router.navigateByUrl("/");
  }

  onBackToHomePage() {
    this.returnToHomePage();
  }

  onReservedBookingExpired() {
    this.subscription.unsubscribe();
    this.cancelAllBookingTable(function () {
      console.log("The tables have been deleted");
    });
    this.modalIsShow = true;
    alert(params.messages.overTenMinutes);
    this.router.navigateByUrl("/");
  }

  returnToHomePage() {
    this.modalIsShow = true;
    this.router.navigateByUrl("/");
  }

  get firstName() {
    return this.confirmBookingForm.get('firstName');
  }

  get lastName() {
    return this.confirmBookingForm.get('lastName');
  }

  get email() {
    return this.confirmBookingForm.get('email');
  }

  get phoneNumber() {
    return this.confirmBookingForm.get('phoneNumber');
  }

  get requirement() {
    return this.confirmBookingForm.get('requirement');
  }

  getMinutes(t) {
    return Math.floor((t / 1000 / 60) % 60);
  }

  getSeconds(t) {
    return Math.floor((t / 1000) % 60);
  }
}

class BookingForTable {
  constructor(
    public _id: string,
    public tableName: string,
  ) {
  }
}
