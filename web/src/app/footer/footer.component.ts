import {Component, OnInit} from '@angular/core';
import {Recipe} from "../../../../../angular-restaurant/src/app/recipes/recipe.model";
import {TableService} from "../services/table.service";
import {Table} from "../shared/table.model";
import {forEach} from "@angular/router/src/utils/collection";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

   selectedTables: Table[] = [];
   totalCustomers: number = 0;

  constructor(private tableService: TableService) {
  }

  ngOnInit() {
    this.tableService.change.subscribe((currentRestaurantTables: Table[]) => {
      this.totalCustomers = 0;
      this.selectedTables = [];
      for (let t of currentRestaurantTables) {
        if (t.selected) {
          this.selectedTables.push(t);
        }

      }
      for (let t of this.selectedTables) {
        this.totalCustomers += t.capacity;
      }
    })
  }

}
