import { PrimaryGeneratedColumn, Entity, Column, ManyToOne } from "typeorm";
import { User } from "./user.entity";
import { WorkItem } from "./work-item.entity";

@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @ManyToOne(type => User, user => user.comments)
  author: User;
  
  @ManyToOne(type => WorkItem, workItem => workItem.commentSection)
  workItem: WorkItem;
}