import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {HomeComponent} from './home/home.component';
import {AppRoutingModule} from "./app-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ConfirmBookingComponent} from './confirm-booking/confirm-booking.component';
import {NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AuthComponent} from './auth/auth.component';
import {SigninComponent} from './auth/signin/signin.component';
import {SignupComponent} from './auth/signup/signup.component';
import {AuthenService} from "./services/auth.service"
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {TableService} from "./services/table.service";
import {TableElementComponent} from './home/table-element/table-element.component';
import {AuthGuard} from "./services/auth-guard.service";
import {CanDeactivateGuard} from "./services/can-deactivate-guard.service";
import {Router} from "@angular/router";
import {AuthenInterceptor} from "./services/authen-interceptor";
import {DialogModalComponent} from './dialog-modal/dialog-modal.component';
import { BookingHistoryComponent } from './booking-history/booking-history.component';
import {NgxPaginationModule} from "ngx-pagination";
import { BookingHistoryElementComponent } from './booking-history/booking-history-element/booking-history-element.component';
import { SweerAlertService } from './dialog-modal/sweet-alert.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from "@ngx-translate/http-loader";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    ConfirmBookingComponent,
    AuthComponent,
    SigninComponent,
    SignupComponent,
    TableElementComponent,
    DialogModalComponent,
    BookingHistoryComponent,
    BookingHistoryElementComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    TranslateModule.forRoot({
      loader: {
      provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    NgbModule.forRoot(),
  ],
  providers: [
    FormsModule,
    AuthenService,
    TableService,
    AuthGuard,
    SweerAlertService,
    CanDeactivateGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: function (router: Router, dialog: NgbModal) {
        return new AuthenInterceptor(router, dialog);
      },
      multi: true,
      deps: [Router, NgbModal]
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    DialogModalComponent
  ]
})
export class AppModule {
}
