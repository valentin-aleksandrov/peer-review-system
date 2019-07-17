import { Component, OnInit } from '@angular/core';
import { WorkItemDataService } from '../core/services/work-item-data.service';

// pull-requests.component
@Component({
    selector: 'pull-requests',
    templateUrl: './pull-requests.component.html',
    styleUrls: ['./pull-requests.component.css']
  })
  export class PullRequestsComponent implements OnInit{
  
    constructor(private readonly workItemDataService: WorkItemDataService){
      
    }
    ngOnInit(): void {
      
    }


      
  }
  