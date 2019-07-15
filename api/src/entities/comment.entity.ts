import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Review } from "./review.entity";
import { WorkItem } from "./work-item.entity";
import { User } from "./user.entity";

@Entity('comments')
export class CommentEntity { // 'Comment' is not a free indentifiactor.
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('nvarchar') 
  content: string;

  @ManyToOne((type) => WorkItem, (workitem) => workitem.comments)
  workItem: Promise<WorkItem>;

  @ManyToOne((type) => User, (user) => user.comments, {
    eager: true,
  })
  author: User;
}
