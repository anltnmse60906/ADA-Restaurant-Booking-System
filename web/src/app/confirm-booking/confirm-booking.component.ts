import {Component, OnInit} from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, Router} from "@angular/router";
import {TableService} from "../services/table.service";
import {DatePipe} from "@angular/common";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-confirm-booking',
  templateUrl: './confirm-booking.component.html',
  styleUrls: ['./confirm-booking.component.css'],
  providers: [DatePipe]
})
export class ConfirmBookingComponent implements OnInit {
  closeResult: string;
  confirmBookingForm: FormGroup;
  bookingSuccess = false;

  constructor(private modalService: NgbModal,
              private calendar: NgbCalendar,
              private router: Router,
              private tableService: TableService,
              private datePipe: DatePipe,
              private routes: ActivatedRoute) {
  }

  ngOnInit() {
    this.confirmBookingForm = new FormGroup({
      email: new FormControl("",
        [Validators.required,
          Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
        ]),
      lastName: new FormControl("", Validators.required),
      firstName: new FormControl("", Validators.required),
      phoneNumber: new FormControl("", Validators.required),
      requirement: new FormControl("", [Validators.maxLength(300)]),
    })
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.router.navigate(["submit"], {relativeTo: this.routes})
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

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
    let selectedTables = this.tableService.getSelectedTables();
    let total = selectedTables.length;
    let count = 0;
    for (let t of selectedTables) {
      let data = {
        lastName: this.confirmBookingForm.value.lastName,
        firstName: this.confirmBookingForm.value.firstName,
        email: this.confirmBookingForm.value.email,
        phoneNumber: this.confirmBookingForm.value.phoneNumber,
        requirement: this.confirmBookingForm.value.requirement,
        bookingTable: t,
        section: localStorage.getItem("selectedSection"),
        bookingDate: this.datePipe.transform(localStorage.getItem("selectedBookingDay"), "dd-MM-yyyy"),
        userId: localStorage.getItem("userId")
      };
      this.tableService.confirmBooking("token=" + localStorage.getItem("token"), data).subscribe((response) => {
        console.log(response);
        count++;
        if (total === count) {
          this.bookingSuccess = true;
          this.confirmBookingForm.reset();
        }
      });
    }
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
}
