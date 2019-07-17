import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SimpleTeamInfo } from 'src/app/models/simple-team-info';

@Injectable({
    providedIn: 'root'
  })
  export class TeamService {

      constructor(private http: HttpClient) {}
      // tslint:disable-next-line: no-unused-expression
      public getTeamInvitations(): Observable<any>{
          return
      }

      public createNewTeam(team): Observable<any> {
          return this.http.post<any>('http://localhost:3000/api/team', team);
      }

      public getTeamsByUserId(userId: string): Observable<SimpleTeamInfo[]> {
          return this.http.get<SimpleTeamInfo[]>(`http://localhost:3000/api/team/user/${userId}`);
      }
  }