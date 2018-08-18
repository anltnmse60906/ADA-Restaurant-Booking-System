import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {SearchResultListComponent} from "./search-result-list/search-result-list.component";
import {SigninComponent} from './auth/signin/signin.component';
import {SignupComponent} from './auth/signup/signup.component';

const appRoutes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path:"restaurants",
    component:SearchResultListComponent
  },
  {  path: 'signin',
     component:SigninComponent
  },
  {  path: 'signup',
     component:SignupComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
