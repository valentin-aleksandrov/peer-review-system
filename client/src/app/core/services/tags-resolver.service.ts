import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Tag } from 'src/app/models/tag';
import { WorkItemDataService } from './work-item-data.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: "root"
  })
  export class TagsResolverService
    implements Resolve<Tag[] | { tags: Tag[] }> {
    
    constructor(
      private readonly workItemDataService: WorkItemDataService,
    ) {
     
    }
    public resolve(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ): Observable<any[]> | Promise<any[]> | any {
        console.log('tags resolver');
        
      return this.workItemDataService
        .getTags()
        .pipe(
          catchError(res => {
            return of([{ tags: null }]);
          })
        );
    }
  }