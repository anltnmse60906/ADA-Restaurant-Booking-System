import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {RestaurantComponent} from "./restaurant/restaurant.component";
import {ConfirmBookingComponent} from "./restaurant/confirm-booking/confirm-booking.component";
import {SearchResultsComponent} from "./restaurant/search-results/search-results.component";
import {SigninComponent} from './auth/signin/signin.component';
import {SignupComponent} from './auth/signup/signup.component';
import {SubmitBookingComponent} from "./restaurant/confirm-booking/submit-booking/submit-booking.component";

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
    path: "restaurants",
    component: RestaurantComponent, children: [
      {
        path: ":id",
        component: ConfirmBookingComponent
      },
      {
        path: "",
        component: SearchResultsComponent
      },
      {
        path: ":id/submit",
        component: SubmitBookingComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
