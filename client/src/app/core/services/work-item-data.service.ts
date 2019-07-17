import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })
  export class WorkItemDataService {

      constructor(private http: HttpClient) {}
      
      public getUserWorkItems(userId: string): Observable<any> {
          return this.http.get<any>(`http://localhost:3000/api/users`);
      }

/*
      public createNewTeam(team): Observable<any> {
        return this.http.post<any>('http://localhost:3000/api/team', team);
    }
      
*/
  }