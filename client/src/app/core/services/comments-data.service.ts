
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from 'src/app/models/comment';

@Injectable({
    providedIn: 'root'
  })
  export class CommentsDataService {

    constructor(private http: HttpClient) {}
      
    public addComment(workItemId: string, commentValue: string): Observable<Comment> {
        return this.http.post<Comment>(`http://localhost:3000/api/work-item/${workItemId}/review-requests/${'useless'}/comments`,{content: commentValue});
    }
}