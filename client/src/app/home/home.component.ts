import { Component, OnInit } from '@angular/core';
import { WorkItemDataService } from '../core/services/work-item-data.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
  })
  export class HomeComponent implements OnInit{
    constructor(private readonly workItemDataService: WorkItemDataService){
      
    }
    ngOnInit(): void {
      this.workItemDataService.getUserWorkItems('no-yet').subscribe((data)=>console.log(data));
    }

  }