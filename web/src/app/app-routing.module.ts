import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {RestaurantComponent} from "./restaurant/restaurant.component";
import {ConfirmBookingComponent} from "./restaurant/confirm-booking/confirm-booking.component";
import {SearchResultsComponent} from "./restaurant/search-results/search-results.component";

const appRoutes: Routes = [
  {
    path: "",
    component: HomeComponent
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
        path: ":id/confirm",
        component: ConfirmBookingComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
