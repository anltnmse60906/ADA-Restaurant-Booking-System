import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {NgbActiveModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-dialog-modal',
  templateUrl: './dialog-modal.component.html',
  styleUrls: ['./dialog-modal.component.css']
})
export class DialogModalComponent implements OnInit {

  message: string = "";
  navigateByUrl: string = "";

  constructor(private router: Router,
              public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }

  onConfirm() {
    this.activeModal.close("Modal Close");
    this.router.navigateByUrl(this.navigateByUrl);
  }
}
