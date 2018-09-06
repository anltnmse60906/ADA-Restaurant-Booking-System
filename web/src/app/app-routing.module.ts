import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {RestaurantComponent} from "./restaurant/restaurant.component";
import {ConfirmBookingComponent} from "./confirm-booking/confirm-booking.component";
import {SearchResultsComponent} from "./restaurant/search-results/search-results.component";
import {SigninComponent} from './auth/signin/signin.component';
import {SignupComponent} from './auth/signup/signup.component';
import {AuthGuard} from "./services/auth-guard.service";

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
    component: ConfirmBookingComponent
  },
  {
    path: "restaurants",
    component: RestaurantComponent, children: [
      // {
      //   path: ":id",
      //   component: ConfirmBookingComponent
      // },
      {
        path: "",
        component: SearchResultsComponent
      },
      // {
      //   path: ":id/submit",
      //   component: SubmitBookingComponent
      // }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
