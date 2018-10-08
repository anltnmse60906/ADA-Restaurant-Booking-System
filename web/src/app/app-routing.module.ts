import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {ConfirmBookingComponent} from "./confirm-booking/confirm-booking.component";
import {SigninComponent} from './auth/signin/signin.component';
import {SignupComponent} from './auth/signup/signup.component';
import {AuthGuard} from "./services/auth-guard.service";
import {CanDeactivateGuard} from "./services/can-deactivate-guard.service";
import {BookingHistoryComponent} from "./booking-history/booking-history.component";

const appRoutes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: 'signin',
    component: SigninComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: "booking/confirm",
    canActivate: [AuthGuard],
    component: ConfirmBookingComponent,
    canDeactivate: [CanDeactivateGuard],
  },
  {
    path: "booking/history",
    canActivate: [AuthGuard],
    component: BookingHistoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
