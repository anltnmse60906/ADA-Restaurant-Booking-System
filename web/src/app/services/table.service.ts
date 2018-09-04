import {EventEmitter, Injectable, Output} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {catchError, map} from "rxjs/operators";
import {throwError} from "rxjs";
import {AIPResponse} from "../shared/response.model";
import {Table} from "../shared/table.model";
import {forEach} from "@angular/router/src/utils/collection";


const httpOption = {
  headers: new HttpHeaders({"Content-Type": "application/json"})
};

@Injectable({
  providedIn: 'root'
})

export class TableService {
  currentRestaurantTables: Table[];

  private tableUrl = "tables/";
  @Output() change: EventEmitter<Table[]> = new EventEmitter<Table[]>();

  constructor(public http: HttpClient) {
  }

  getTables(section, bookingDate) {
    return this.http.get(environment.backEndHost + this.tableUrl + "?section=" + section + "&bookingDate=" + bookingDate, httpOption)
      .pipe(map((response) => {
        let aipResponse = new AIPResponse().fromJSON(response);
        const tables = aipResponse.obj;
        let tranformedTables: Table[] = [];
        for (let m of  Array.from(tables)) {
          tranformedTables.push(new Table(m["_id"], m["name"], m["capacity"], m["location"], m["isSmoking"], m["isBooked"]))
        }
        this.currentRestaurantTables = tranformedTables;
        return tranformedTables;
      }))
      .pipe(catchError((error) => throwError(error)));
  }

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
    this.change.emit(this.currentRestaurantTables);
  }

  getSelectedTables() {
    let selectedTables: Table[] = [];
    for (let t of this.currentRestaurantTables) {
      if (t.selected) {
        selectedTables.push(t);
      }
    }
    return selectedTables;
  }

  confirmBooking(queryParam, formData) {
    return this.http.post(environment.backEndHost + this.tableUrl + "create-new-booking?" + queryParam, formData, httpOption)
      .pipe(map(response => response))
      .pipe(catchError((error) => throwError(error)));
  }
}

