import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import {AppRoutingModule} from "./app-routing.module";
import { RestaurantComponent } from './restaurant/restaurant.component';
import { SearchResultsComponent } from './restaurant/search-results/search-results.component';
import {FormsModule} from "@angular/forms";
import { ConfirmBookingComponent } from './restaurant/confirm-booking/confirm-booking.component';
import { SearchResultDetailComponent } from './restaurant/search-results/search-result-detail/search-result-detail.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    RestaurantComponent,
    SearchResultsComponent,
    ConfirmBookingComponent,
    SearchResultDetailComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NgbModule.forRoot()
  ],
  providers: [FormsModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
