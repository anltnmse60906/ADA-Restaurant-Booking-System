import {Validators} from "@angular/forms";

export const params = {
    dateTimePattern: "dd-MM-yyyy",
    emailPattern: "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?",

    tableUrl: "tables/",
    tableAuthUrl: "tables/auth/",
    messages: {
      overTenMinutes: "Your confirming table reservation time is over 10 minutes. Please reserve other tables!!!",
      cancelTableReservation: "If you leave, your reserved tables will be canceled!!!",
      tokenExpired: "Please login again to keep using our services",
    }
  }
;
