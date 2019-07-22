import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { UserDetails } from 'src/app/models/user-details';
import { WorkItem } from 'src/app/models/work-item';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'item-details',
    templateUrl: './item-details.component.html',
    styleUrls: ['./item-details.component.css'],
  })
  export class ItemDetails implements OnInit{
    public workItem: WorkItem;  
    constructor(
      private readonly router: Router,
      private readonly activatedRoute: ActivatedRoute,
    ){}

    ngOnInit(): void {
      this.activatedRoute.data.subscribe((data) => {
        this.workItem = data.workItem;
      });
    }
  }