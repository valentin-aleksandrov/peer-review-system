import { Injectable } from "@angular/core";
import { WorkItem } from "src/app/models/work-item";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { WorkItemDataService } from "src/app/core/services/work-item-data.service";
import { of, Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { User } from "src/app/models/user";
import { AuthenticationService } from "./authentication.service";

@Injectable({
  providedIn: "root"
})
export class SingleUserResolverService
  implements Resolve<WorkItem[] | { workitems: WorkItem[] }> {
  currentUser: User;
  constructor(
    private readonly workItemDataService: WorkItemDataService,
    private readonly authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(
      x => (this.currentUser = x)
    );
  }

  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.workItemDataService
      .getWorkItemsByUserId(this.currentUser.user.id)
      .pipe(
        catchError(res => {
          //console.log("Fail to find workItems"),
          return of({ workItems: null });
        })
      );
  }
}
