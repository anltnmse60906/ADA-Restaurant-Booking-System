import {Injectable} from "@angular/core"
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../shared/user.model";
import {catchError, map} from "rxjs/operators";
import {throwError} from "rxjs";
import {environment} from 'src/environments/environment';


const httpOption = {
  headers: new HttpHeaders({"Content-Type": "application/json"})
};

@Injectable({
  providedIn: 'root',
})

export class AuthenService {
  private authenUrl = "users/";

  constructor(private http: HttpClient) {
  }

  signUp(user: User) {
    const body = JSON.stringify(user);
    return this.http.post(environment.backEndHost + this.authenUrl + "sign-up", body, httpOption)
      .pipe(map((response) => response))
      .pipe(catchError((error) => throwError(error)));
  }

  signIn(user: User) {
    const body = JSON.stringify(user);
    return this.http.post(environment.backEndHost + this.authenUrl + "sign-in", body, httpOption)
      .pipe(map((response) => response))
      .pipe(catchError((error) => throwError(error)));
  }

  isLoggedIn() {
    return localStorage.getItem("token") !== null;
  }

  logOut() {
    location.reload();
    localStorage.clear();
  }
}

