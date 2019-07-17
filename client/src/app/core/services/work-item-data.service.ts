import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserDetails } from 'src/app/models/user-details';

@Injectable({
    providedIn: 'root'
  })
  export class WorkItemDataService {

      constructor(private http: HttpClient) {}
      
      public getUsers(): Observable<UserDetails[]> {
          return this.http.get<UserDetails[]>(`http://localhost:3000/api/users`);
      }

/*
      public createNewTeam(team): Observable<any> {
        return this.http.post<any>('http://localhost:3000/api/team', team);
    }
      
*/
  }