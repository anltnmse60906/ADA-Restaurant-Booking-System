import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Table} from "../../shared/table.model";
import {TableService} from "../../services/table.service";

@Component({
  selector: 'app-table-element',
  templateUrl: './table-element.component.html',
  styleUrls: ['./table-element.component.css', '../home.component.css']
})
export class TableElementComponent implements OnInit {
  @Input("TableElement") table: Table;
  @Output() test = new EventEmitter<void>();

  constructor(private tableService: TableService) {
  }

  ngOnInit() {
  }

  changeValue() {
    this.tableService.selectTable(this.table);
  }
}
