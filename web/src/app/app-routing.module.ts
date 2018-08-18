import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {SearchResultListComponent} from "./search-result-list/search-result-list.component";

const appRoutes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path:"restaurants",
    component:SearchResultListComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
