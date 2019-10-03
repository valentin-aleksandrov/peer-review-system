import { Injectable } from '@angular/core';
import { WorkItem } from 'src/app/models/work-item';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { WorkItemDataService } from 'src/app/core/services/work-item-data.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })
  export class itemDetailsResolverService implements Resolve<WorkItem | {workItem: WorkItem}> {
  
    constructor(
      private readonly workItemDataService: WorkItemDataService
    ) { }
  
    public resolve(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot,
    ) {
      const workItemId = route.params['id'];

      return this.workItemDataService.getWorkItemById(workItemId)
        .pipe(catchError(
          res => {
            console.log('Fail to find workItem with ',workItemId,' id.');
            return of({workItem: null});
          }
        ));
    }
  }
  