import { Component } from '@angular/core';

// pull-requests.component
@Component({
    selector: 'pull-requests',
    templateUrl: './pull-requests.component.html',
    styleUrls: ['./pull-requests.component.css']
  })
  export class PullRequestsComponent{
    public pullRequests: any = [
      {
        id: 1,
        title: "pull requenst one"
      },
      {
        id: 2,
        title: "pull requenst one"
      },
      {
        id: 3,
        title: "pull requenst two"
      },
    ];
      
  }
  