import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {HomeComponent} from './home/home.component';
import {AppRoutingModule} from "./app-routing.module";
import {RestaurantComponent} from './restaurant/restaurant.component';
import {SearchResultsComponent} from './restaurant/search-results/search-results.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ConfirmBookingComponent} from './confirm-booking/confirm-booking.component';
import {SearchResultDetailComponent} from './restaurant/search-results/search-result-detail/search-result-detail.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AuthComponent} from './auth/auth.component';
import {SigninComponent} from './auth/signin/signin.component';
import {SignupComponent} from './auth/signup/signup.component';
import {SubmitBookingComponent} from './confirm-booking/submit-booking/submit-booking.component';
import {AuthenService} from "./services/auth.service"
import {HttpClientModule} from "@angular/common/http";
import {TableService} from "./services/table.service";
import {TableElementComponent} from './home/table-element/table-element.component';
import {AuthGuard} from "./services/auth-guard.service";
import {CanDeactivateGuard} from "./services/can-deactivate-guard.service";


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    RestaurantComponent,
    SearchResultsComponent,
    ConfirmBookingComponent,
    SearchResultDetailComponent,
    AuthComponent,
    SigninComponent,
    SignupComponent,
    SubmitBookingComponent,
    TableElementComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule.forRoot(),
  ],
  providers: [
    FormsModule,
    AuthenService,
    TableService,
    AuthGuard,
    CanDeactivateGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
