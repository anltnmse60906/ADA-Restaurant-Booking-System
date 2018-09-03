import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NgbCalendar} from "@ng-bootstrap/ng-bootstrap";
import {TableService} from "../services/table.service";
import {Table} from "../shared/table.model";
import {FormControl} from "@angular/forms";




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  model;

  topLeft: Table[] = [];
  topRight: Table[] = [];
  rightBar: Table[] = [];
  leftKitchen: Table[] = [];
  rightKitchen: Table[] = [];

  myCheckBoxes: FormControl = new FormControl();

  constructor(private router: Router,
              private routes: ActivatedRoute,
              private calendar: NgbCalendar,
              private tableService: TableService) {
  }

  ngOnInit() {
    this.tableService.getTables().subscribe((tables: Table[]) => {
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
    });
    this.myCheckBoxes.valueChanges.subscribe(value => {
      console.log('my chebox has changed', value);
    })
  }

  onFindRestaurant() {
    // this.router.navigate(['restaurants'], {relativeTo: this.routes})
    this.router.navigate(['/restaurants', 1]);
  }

  

}
