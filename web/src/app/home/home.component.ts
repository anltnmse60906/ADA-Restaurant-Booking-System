import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NgbCalendar} from "@ng-bootstrap/ng-bootstrap";
import {TableService} from "../services/table.service";
import {Table} from "../shared/table.model";
import {NgbDateAdapter, NgbDateNativeAdapter,} from '@ng-bootstrap/ng-bootstrap';
import {DatePipe} from "@angular/common";
import {params} from "../shared/common.params";
import {AuthenService} from "../services/auth.service";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [
    {provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}, DatePipe
  ]

})
export class HomeComponent implements OnInit {

  private _bookingDate: Date;
  today = new Date;
  private _selectedSection;

  startDate = {};

  topLeft: Table[] = [];
  topRight: Table[] = [];
  rightBar: Table[] = [];
  leftKitchen: Table[] = [];
  rightKitchen: Table[] = [];

  selectedTables: Table[] = [];
  totalCustomers: number = 0;

  private _currentBookingDate: Date;
  private _currentSection: string;

  constructor(private router: Router, private routes: ActivatedRoute,
              private calendar: NgbCalendar,
              private tableService: TableService,
              private authenService: AuthenService,
              private datePipe: DatePipe,) {
  }

  ngOnInit() {
    this._bookingDate = new Date();

    this._currentSection = this.sectionNumberToString(parseInt(this._selectedSection, 10));
    this._currentBookingDate = this._bookingDate;

    this._selectedSection = 1;
    if (this.today.getHours() > 11 && this.today.getHours() < 16) {
      this._selectedSection = 2
    } else if (this.today.getHours() > 15 && this.today.getHours() < 20) {
      this._selectedSection = 3
    } else if (this.today.getHours() > 20 && this.today.getHours() <= 23) {
      this._bookingDate.setDate(this._bookingDate.getDate() + 1);
    }

    this.startDate = {
      year: this._bookingDate.getFullYear(),
      month: this._bookingDate.getMonth() + 1,
      day: this._bookingDate.getDate()
    };
    this.tableService.getTables(this._selectedSection, this.datePipe.transform(this._bookingDate, params.dateTimePattern)).subscribe((tables: Table[]) => {
      this.parseTable(tables);
    });

    // this function will be trigged when we updateConfirmFooter the selected table
    this.tableService.updateConfirmFooter.subscribe((currentRestaurantTables: Table[]) => {
      this.totalCustomers = 0;
      this.selectedTables = [];
      for (let t of currentRestaurantTables) {
        if (t.selected) {
          this.selectedTables.push(t);
          this.totalCustomers += t.capacity;
        }
      }
    });
  }

  onSubmit() {
    this._currentSection = this.sectionNumberToString(parseInt(this._selectedSection, 10));
    this._currentBookingDate = this._bookingDate;
    this.tableService.removeSelectedTables();
    this.tableService.getTables(this._selectedSection, this.datePipe.transform(this._bookingDate, params.dateTimePattern)).subscribe((tables: Table[]) => {
      this.parseTable(tables);
    });

  }

  onChangeSection(event) {
    this._selectedSection = event;
  }

  onChangeBookingDate(event) {
    this._bookingDate = new Date(event);
  }

  parseTable(tables: Table[]) {
    this.topLeft = [];
    this.topRight = [];
    this.leftKitchen = [];
    this.rightKitchen = [];
    for (const tbl of tables) {
      if (tbl.location === "top-right") {
        this.topRight.push(tbl);
      } else if (tbl.location === "top-left") {
        this.topLeft.push(tbl);
      } else if (tbl.location === "right-bar") {
        this.rightBar.push(tbl);
      } else if (tbl.location === "left-kitchen") {
        this.leftKitchen.push(tbl);
      } else if (tbl.location === "right-kitchen") {
        this.rightKitchen.push(tbl);
      }
    }
  }

  onConfirmBooking() {

    if (this.authenService.isLoggedIn()) {
      localStorage.setItem("max-people", this.totalCustomers.toString());
      localStorage.setItem("selectedBookingDay", this.datePipe.transform(this._bookingDate, params.dateTimePattern));
      localStorage.setItem("selectedSection", this._selectedSection);


      let selectedTables = this.tableService.getSelectedTablesList();
      let total = selectedTables.length;
      let count = 0;
      let isFailed = false;
      let reservedSuccessfullyTables = [];
      for (let t of selectedTables) {
        let data = {
          bookingTable: t,
          section: this._selectedSection,
          bookingDate: this.datePipe.transform(this._bookingDate, params.dateTimePattern)
        };
        this.tableService.reserveTable("", data).subscribe((response) => {
          console.log(response);
          let success = response["obj"].success;
          count++;
          if (!success) {
            //show message when select table is reserved

            let otherReservedTable = this.tableService.getSelectedTableById(response["obj"].data.tableId._id);
            // this.tableService.selectTable(otherReservedTable);
            otherReservedTable.isBooked = true;
            otherReservedTable.selected = false;
            this.tableService.updateSelectedTable(otherReservedTable);
            alert("Table " + response["obj"].data.tableId.name + " is reserved");
            isFailed = true;
          } else {
            console.log("table is reserved successfully: " + response["obj"].data);
            reservedSuccessfullyTables.push(response["obj"].data);
          }
          if (total === count) {
            // alert("reserved successfully");
            //TODO Go to nextpage for edit
            if (isFailed) {
              for (let t of reservedSuccessfullyTables) {
                let otherReservedTable = this.tableService.getSelectedTableById(t.tableId);
                this.tableService.selectTable(otherReservedTable);
                let obj = {
                  bookingId: t._id
                };
                this.tableService.deleteReservedTable("", obj).subscribe((response) => {
                  console.log(response);
                })
              }
            } else {
              this.router.navigateByUrl("booking/confirm");
            }
          }
        });
      }
    } else {
      // this.router.navigate(['signin'], { queryParams: { returnUrl: state.url }});
      this.tableService.updateSelectedTableBeforeLogin(this.tableService.getSelectedTablesList());
      this.router.navigate(['signin'],);
    }


  }


  sectionNumberToString(section: number) {
    if (section === 1) {
      return "Breakfast";
    } else if (section === 2) {
      return "Lunch";
    } else if (section === 3) {
      return "Dinner";
    }
    return "";
  }

  //
  // getBookingDate() {
  //   return this.datePipe.transform(this._bookingDate, params.dateTimePattern);
  // }
}
