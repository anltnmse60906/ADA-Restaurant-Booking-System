import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-submit-booking',
  templateUrl: './submit-booking.component.html',
  styleUrls: ['./submit-booking.component.css']
})
export class SubmitBookingComponent implements OnInit {

  constructor(private router: Router,
              private routes: ActivatedRoute) {
  }

  ngOnInit() {
  }

  goBack() {
    this.router.navigate(["/restaurants", this.routes.snapshot.params["id"]]);
  }
}
