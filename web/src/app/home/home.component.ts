import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, Routes} from "@angular/router";
import {NgbCalendar, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  model;


  constructor(private router: Router,
              private routes: ActivatedRoute,
              private calendar: NgbCalendar,) {
  }

  ngOnInit() {
  }

  onFindRestaurant() {
    this.router.navigate(['restaurants'], {relativeTo: this.routes})
  }
  selectToday() {
    this.model = this.calendar.getToday();
  }
}
