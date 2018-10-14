import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import {from, Observable, of, throwError} from "rxjs";
import {Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {catchError} from "rxjs/operators";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {DialogModalComponent} from "../dialog-modal/dialog-modal.component";
import {params} from "../shared/common.params";

@Injectable()
export class AuthenInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request to add the new header.
    console.log('intercepted');

    // catch the error, make specific functions for catching specific errors and you can chain through them with more catch operators
    return next.handle(req).pipe(catchError((error) => this.handleError(error)));
    //here use an arrow function, otherwise you may get "Cannot read property 'navigate' of undefined" on angular 4.4.2/net core 2/webpack 2.70

  }

  constructor(private router: Router,
              private modalService: NgbModal
  ) {
  }

  private dialog: NgbModalRef;

  handleError(err: HttpErrorResponse): Observable<any> {
    if (err.status === 400 || err.status === 401) {
      // return of(err.message);
      if (this.dialog) {
        this.dialog.close();
      }
      this.dialog = this.modalService.open(DialogModalComponent, {keyboard: false});
      this.dialog.componentInstance.message = params.messages.tokenExpired;
      this.dialog.componentInstance.navigateByUrl = "/signin";

      return from(this.dialog.result.then(function () {
        console.log("call back to the AuthenInterceptor");
        localStorage.clear();
      }));
    }
    return throwError(err);
  }

}
