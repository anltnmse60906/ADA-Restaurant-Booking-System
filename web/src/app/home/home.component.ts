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

  gridSize = 50;

  topLeft = [0, 50, 100, 150, 200, 250];
  topRight = [0, 50, 100, 150, 200, 250, 150, 200, 250];
  barOpposite = [0, 50, 100, 150];
  leftKitchen = [0, 50, 100, 150, 100, 150, 150, 100, 150, 150, 100, 150, 150, 100, 150];
  rightKitchen = [0, 50, 100,];

  tables = ["table 1", "table 2"];
  selectedTbl;

  constructor(private router: Router,
              private routes: ActivatedRoute,
              private calendar: NgbCalendar,) {
  }

  ngOnInit() {
  }

  onFindRestaurant() {
    // this.router.navigate(['restaurants'], {relativeTo: this.routes})
    this.router.navigate(['/restaurants', 1]);
  }

  selectToday() {
    this.model = this.calendar.getToday();
  }

  onStart(event) {
    console.log('started output:', event);
    console.log(event.x);
    console.log(event.y);
  }

  onStop(event) {
    console.log('stopped output:', event);
    console.log(event.x);
    console.log(event.y);
  }

  onClick(event, tbl: string) {
    console.log('stopped output:', event);
    console.log(event.x);
    console.log(event.y);
    this.selectedTbl = tbl;
  }

}
