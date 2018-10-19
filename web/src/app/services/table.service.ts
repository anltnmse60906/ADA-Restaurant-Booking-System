import {EventEmitter, Injectable, Output} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {catchError, map} from "rxjs/operators";
import {throwError} from "rxjs";
import {Table} from "../shared/table.model";
import {params} from "../shared/common.params";


const httpOption = {
  headers: new HttpHeaders({"Content-Type": "application/json"})
};

@Injectable({
  providedIn: 'root'
})

export class TableService {
  currentRestaurantTables: Table[];
  selectedTableBeforeLogin: Table[];
  @Output() updateConfirmFooter: EventEmitter<Table[]> = new EventEmitter<Table[]>();
  @Output() openHistoryBookingModel: EventEmitter<Object> = new EventEmitter<Object>();


  constructor(public http: HttpClient) {
  }

  getTables(section, bookingDate) {
    const token = localStorage.getItem("token") ? "&token=" + localStorage.getItem("token") : "";
    return this.http.get(environment.backEndHost + params.tableUrl +"get-bookings-of-section" + "?section=" + section + "&bookingDate=" + bookingDate + token, httpOption)
      .pipe(map((response) => {
        const tables = response["obj"].tableList;
        const reservedTables = response["obj"].reservedTables;
        const reservedTablesByUserId = response["obj"].reservedTablesByUserId;
        let transformedTables: Table[] = [];

        for (let m of  tables) {
          let booked = false;
          let selected = false;

          // Set selected reserved booking before user login
          if (this.selectedTableBeforeLogin && this.selectedTableBeforeLogin.length !== 0) {
            for (let reservedTable of this.selectedTableBeforeLogin) {
              if (reservedTable._id === m._id) {
                selected = true;
                booked = false;
              }
            }
          }
          // Set selected reserved booking from server from current user
          if (reservedTables) {
            for (let reservedTable of reservedTables) {
              if (reservedTable.tableId._id === m._id) {
                selected = false;
                booked = true;
              }
            }
          }
          // Set selected reserved booking from other users
          if (reservedTablesByUserId) {
            for (let reservedTable of reservedTablesByUserId) {
              if (reservedTable.tableId._id === m._id) {
                selected = true;
                booked = false;
              }
            }
          }
          transformedTables.push(new Table(m["_id"], m["name"], m["capacity"], m["location"], m["isSmoking"], booked, selected))
        }
        this.currentRestaurantTables = transformedTables;

        this.updateConfirmFooter.emit(this.currentRestaurantTables);

        return transformedTables;
      }))
      .pipe(catchError((error) => throwError(error)));
  }

  getReservedTableByUser(section, bookingDate) {
    const token = localStorage.getItem("token") ? "&token=" + localStorage.getItem("token") : "";
    return this.http.get(environment.backEndHost + params.tableAuthUrl + "get-current-unconfirmed-bookings" + "?section=" + section + "&bookingDate=" + bookingDate + token, httpOption)
      .pipe(map(response => response))
      .pipe(catchError((error) => throwError(error)));
  }

  getBookingHistory(queryParam){
    const token = localStorage.getItem("token") ? "&token=" + localStorage.getItem("token") : "";
    return this.http.get(environment.backEndHost + params.tableAuthUrl + "users-booking-history-list?"  + queryParam + token, httpOption)
      .pipe(map(response => response))
      .pipe(catchError((error) => throwError(error)));
  }

  confirmBooking(queryParam, formData) {
    const token = localStorage.getItem("token") ? "?token=" + localStorage.getItem("token") : "";
    return this.http.post(environment.backEndHost + params.tableAuthUrl + "confirm-reserved-bookings" + queryParam + token, formData, httpOption)
      .pipe(map(response => response))
      .pipe(catchError((error) => throwError(error)));
  }

  reserveTable(queryParam, formData) {
    const token = localStorage.getItem("token") ? "?token=" + localStorage.getItem("token") : "";
    return this.http.post(environment.backEndHost + params.tableAuthUrl + "reserve-table" + queryParam + token, formData, httpOption)
      .pipe(map(response => response))
      .pipe(catchError((error) => throwError(error)));
  }

  deleteReservedTable(queryParam, formData) {
    const token = localStorage.getItem("token") ? "?token=" + localStorage.getItem("token") : "";
    return this.http.post(environment.backEndHost + params.tableAuthUrl + "delete-reserved-booking" + queryParam + token, formData, httpOption)
      .pipe(map(response => response))
      .pipe(catchError((error) => throwError(error)));
  }

  // This function is called when user click select table for booking
  selectTable(table: Table) {
    let curTbl = table;
    curTbl.selected = (!table.selected);

    let i = 0;
    for (let t of this.currentRestaurantTables) {
      if (t.name === curTbl.name) {
        this.currentRestaurantTables[i].selected = curTbl.selected
      }
      i++;
    }
    // calling to footer for updating
    this.updateConfirmFooter.emit(this.currentRestaurantTables);
  }

  getSelectedTablesList(): Table[] {
    let selectedTables: Table[] = [];
    for (let t of this.currentRestaurantTables) {
      if (t.selected) {
        selectedTables.push(t);
      }
    }
    return selectedTables;
  }

  removeSelectedTables() {
    let selectedTables = this.getSelectedTablesList();
    for (let i = 0; i < selectedTables.length; i++) {
      let selectedTable = selectedTables[i];
      selectedTable.selected = false;
      selectedTables[i] = selectedTable;
    }
    this.updateConfirmFooter.emit(this.currentRestaurantTables);
  }

  getSelectedTableById(id: string): Table {
    let selectedTables = this.getSelectedTablesList();
    for (let table of selectedTables) {
      if (table._id === id) {
        return table
      }
    }
  }

  updateSelectedTable(updatedTable: Table) {
    let count = 0;
    for (let table of this.currentRestaurantTables) {
      if (table._id === updatedTable._id) {
        this.currentRestaurantTables[count] = updatedTable;
      }
      count++;
    }
    this.updateConfirmFooter.emit(this.currentRestaurantTables);
  }

  updateSelectedTableBeforeLogin(selectedTable: Table[]) {
    this.selectedTableBeforeLogin = selectedTable;
  }


  sectionNumberToCategorical(section: number) {
    if (section === 1) {
      return "Breakfast";
    } else if (section === 2) {
      return "Lunch";
    } else if (section === 3) {
      return "Dinner";
    }
    return "";
  }
}

