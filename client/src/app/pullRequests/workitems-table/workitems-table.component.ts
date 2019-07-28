import { Component, OnInit, Input } from "@angular/core";
import { WorkItem } from "src/app/models/work-item";

@Component({
  selector: "app-workitems-table",
  templateUrl: "./workitems-table.component.html",
  styleUrls: ["./workitems-table.component.css"]
})
export class WorkitemsTableComponent implements OnInit {
  @Input()
  workItems: WorkItem[];
  constructor() {}

  ngOnInit() {}
}
