import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserDetails } from 'src/app/models/user-details';
import { Tag } from 'src/app/models/tag';
import { CreateWorkItem } from 'src/app/models/create-work-item';

@Injectable({
    providedIn: 'root'
  })
  export class WorkItemDataService {

      constructor(private http: HttpClient) {}
      
      public getUsers(): Observable<UserDetails[]> {
          return this.http.get<UserDetails[]>(`http://localhost:3000/api/users`);
      }

      public getTags(): Observable<Tag[]> {
          return this.http.get<Tag[]>(`http://localhost:3000/api/work-item/tags`)
      }

      public createWorkItem(workItem: CreateWorkItem): Observable<any> {
          return this.http.post<any>('http://localhost:3000/api/work-item',workItem);
      }
  }