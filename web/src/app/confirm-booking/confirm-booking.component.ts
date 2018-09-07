import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal, NgbCalendar, NgbModalRef, NgbModalConfig,} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, Router} from "@angular/router";
import {TableService} from "../services/table.service";
import {DatePipe} from "@angular/common";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {interval, Observable, Subject, Subscription} from "rxjs";
import {map} from "rxjs/operators";
import {ComponentCanDeactivate} from "../shared/component-can-deactivate";
import {params} from "../shared/common.params";
import {DialogModalComponent} from "../dialog-modal/dialog-modal.component";

@Component({
  selector: 'app-confirm-booking',
  templateUrl: './confirm-booking.component.html',
  styleUrls: ['./confirm-booking.component.css'],
  providers: [DatePipe]
})


export class ConfirmBookingComponent implements OnInit, ComponentCanDeactivate {
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
  @ViewChild("content") content;
  modal: NgbModalRef;
  modalIsShow: boolean = false;
  confirmSuccess: boolean = false;

  constructor(private modalService: NgbModal,
              private ngbModalConfig: NgbModalConfig,
              private calendar: NgbCalendar,
              private router: Router,
              private tableService: TableService,
              private datePipe: DatePipe,
              private routes: ActivatedRoute,
  ) {
    ngbModalConfig.backdrop = "static";
    ngbModalConfig.keyboard = false;

  }

  canDeactivate(): boolean {
    if (this.modalIsShow) {
      return false;
    } else {
      return true
    }
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
    // this.expiredTime.setMinutes(this.expiredTime.getMinutes() + 10);
    this.expiredTime.setSeconds(this.expiredTime.getSeconds() + 10);

    this.subscription = interval(1000).pipe(map((x) => {
      this.diff = Math.abs(this.expiredTime.getTime() - new Date().getTime());
    })).subscribe((x) => {
      this.minute = this.getMinutes(this.diff);
      this.second = this.getSeconds(this.diff);

      if (this.minute === 0 && this.second === 0) {
        this.waitForConfirm = false;
        this.subscription.unsubscribe();

        this.cancelAllBookingTable(() => {
          if (this.modal) {
            this.modal.close();
          }
          this.modal = this.modalService.open(DialogModalComponent, {keyboard: false});
          this.modal.componentInstance.message = params.messages.overTenMinutes;
          this.modal.componentInstance.navigateByUrl = "/";
          this.modalIsShow = true;
          // this.router.navigateByUrl("/");
        });
      }
    });

    // this.selectedTables = this.tableService.getSelectedTablesList();
    if (localStorage.getItem("selectedSection") && localStorage.getItem("selectedBookingDay")) {
      this.tableService.getReservedTableByUser(localStorage.getItem("selectedSection"), localStorage.getItem("selectedBookingDay"))
        .subscribe((response) => {
          let bookings = response["obj"].reservedTable;
          let user = response["obj"].user;
          if (bookings && bookings.length > 0) {
            for (let booking of bookings) {
              this.selectedTables.push(new BookingForTable(booking._id, booking.tableId.name));
            }

            this.confirmBookingForm.get("email").setValue(user.email);
            this.confirmBookingForm.get("lastName").setValue(user.lastName);
            this.confirmBookingForm.get("firstName").setValue(user.firstName);
            this.confirmBookingForm.get("phoneNumber").setValue(user.phoneNumber);

          } else {
            this.modalIsShow = true;
            this.router.navigateByUrl("/");
          }
        });
    } else {
      this.router.navigateByUrl("/");
    }
    this.confirmBookingForm = new FormGroup({
      email: new FormControl("",
        [Validators.required,
          Validators.pattern(params.emailPattern)
        ]),
      lastName: new FormControl("", Validators.required),
      firstName: new FormControl("", Validators.required),
      phoneNumber: new FormControl("", Validators.required),
      requirement: new FormControl("", [Validators.maxLength(300)]),
    })

  }

  // open(content) {
  //   if (this.modal) {
  //     this.modal.close();
  //   }
  //   this.modal = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  // }

  getBookingDate() {
    //'fullDate': equivalent to 'EEEE, MMMM d, y' (Monday, June 15, 2015).
    if (localStorage.getItem("selectedBookingDay")) {
      return this.datePipe.transform(localStorage.getItem("selectedBookingDay"), "fullDate");
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

  onSubmit() {
    let total = this.selectedTables.length;
    let count = 0;
    this.subscription.unsubscribe();

    for (let t of this.selectedTables) {
      let data = {
        lastName: this.confirmBookingForm.value.lastName,
        firstName: this.confirmBookingForm.value.firstName,
        email: this.confirmBookingForm.value.email,
        phoneNumber: this.confirmBookingForm.value.phoneNumber,
        requirement: this.confirmBookingForm.value.requirement,
        bookingId: t._id
      };
      this.tableService.confirmBooking("", data).subscribe((response) => {
        console.log(response);
        count++;
        if (total === count) {
          this.bookingSuccess = true;
          this.waitForConfirm = false;
          this.confirmSuccess = true;
          this.confirmBookingForm.disable();
        }
      });
    }
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

  onCancelAllBookingTable(content: NgbModalRef) {
    // const modalRef = this.modalService.open(this.content);

    if (this.modal) {
      this.modal.close();
    }

    this.modal = this.modalService.open(content);
    this.modalIsShow = true;
    this.modal.result.then(() => {
      this.modalIsShow = false;
    })
  }

  onBackToHomePage() {
    this.modalIsShow = true;
    this.router.navigateByUrl("/");
  }

  onConfirm() {
    console.log("onConfirm");
    this.subscription.unsubscribe();
    this.modalIsShow = true;
    this.cancelAllBookingTable(() => {
      console.log("Delete table reservation successfully!!!")
    });
    this.router.navigateByUrl("/");
    this.modal.close();
  }


  getPeople() {
    return (localStorage.getItem("max-people")) ? localStorage.getItem("max-people") : "";
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
