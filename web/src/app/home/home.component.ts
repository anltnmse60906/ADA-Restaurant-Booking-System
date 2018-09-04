import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NgbCalendar} from "@ng-bootstrap/ng-bootstrap";
import {TableService} from "../services/table.service";
import {Table} from "../shared/table.model";
import {NgbDateAdapter, NgbDateNativeAdapter,} from '@ng-bootstrap/ng-bootstrap';
import {DatePipe} from "@angular/common";
import {params} from "../shared/common.params";


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

  startDate = {
    year: this.today.getFullYear(),
    month: this.today.getMonth() + 1,
    day: this.today.getDay()
  };

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
              private tableService: TableService, private datePipe: DatePipe,) {
  }

  ngOnInit() {
    this._bookingDate = new Date();

    localStorage.setItem("selectedBookingDay", new Date().toString());
    localStorage.setItem("selectedSection", this._selectedSection);

    this._currentSection = this.sectionNumberToString(parseInt(this._selectedSection, 10));
    this._currentBookingDate = this._bookingDate;

    this._selectedSection = 1;
    if (this.today.getHours() > 11 && this.today.getHours() < 16) {
      this._selectedSection = 2
    } else if (this.today.getHours() > 15 && this.today.getHours() < 20) {
      this._selectedSection = 3
    }

    this.tableService.getTables(this._selectedSection, this.datePipe.transform(this.today, params.dateTimePattern)).subscribe((tables: Table[]) => {
      this.parseTable(tables);
    });

    this.tableService.change.subscribe((currentRestaurantTables: Table[]) => {
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

    this.tableService.getTables(this._selectedSection, this.datePipe.transform(this._bookingDate, params.dateTimePattern)).subscribe((tables: Table[]) => {
      this.parseTable(tables);
    });
  }

  onChangeSection(event) {
    this._selectedSection = event;
    localStorage.setItem("selectedSection", event);
  }

  onChangeBookingDate(event) {
    this._bookingDate = new Date(event);
    localStorage.setItem("selectedBookingDay", event);
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
    localStorage.setItem("max-people", this.totalCustomers.toString());
    this.router.navigateByUrl("/confirm")
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
