import { UserDetails } from 'src/app/models/user-details';
import { WorkItemDataService } from './work-item-data.service';
import { catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: "root"
  })
  export class UsersResolverService
    implements Resolve<UserDetails[] | { users: UserDetails[] }> {
    
    constructor(
      private readonly workItemDataService: WorkItemDataService,
    ) {
     
    }
    public resolve(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
      return this.workItemDataService
        .getUsers()
        .pipe(
          catchError(res => {
            //console.log("Fail to find workItems"),
            return of({ users: null });
          })
        );
    }
  }