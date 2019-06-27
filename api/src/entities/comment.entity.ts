import { PrimaryGeneratedColumn, Entity, Column, ManyToOne } from "typeorm";
import { User } from "./user.entity";

@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @ManyToOne(type => User, user => user.comments)
  author: User;
  // one WorkItem or one pull request??? Need more reasearch!
}