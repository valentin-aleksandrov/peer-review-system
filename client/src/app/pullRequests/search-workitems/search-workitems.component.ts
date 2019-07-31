import { Component, OnInit } from "@angular/core";
import { WorkItem } from "src/app/models/work-item";
import { NotificatorConfigService } from 'src/app/core/services/notificator-config.service';

@Component({
  selector: "app-search-workitems",
  templateUrl: "./search-workitems.component.html",
  styleUrls: ["./search-workitems.component.css"]
})
export class SearchWorkitemsComponent implements OnInit {
  public workItems: WorkItem[] = [];
  constructor(
    private readonly notificatorConfigService: NotificatorConfigService,
  ) {}

  ngOnInit() {
    this.notificatorConfigService.configEngagespotNotificator();
  }

  updateTable(data: any) {
    this.workItems = data;
  }
}
