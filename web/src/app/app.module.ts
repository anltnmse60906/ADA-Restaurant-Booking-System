import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import {AppRoutingModule} from "./app-routing.module";
import { SearchResultListComponent } from './search-result-list/search-result-list.component';
import { SearchResultItemComponent } from './search-result-list/search-result-item/search-result-item.component';
import {FormsModule} from "@angular/forms";
import { AuthComponent } from './auth/auth.component';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    SearchResultListComponent,
    SearchResultItemComponent,
    AuthComponent,
    SigninComponent,
    SignupComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
  ],
  providers: [FormsModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
