import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { User } from "./user.entity";
import { Status } from "./status.entity";
import { Team } from "./team.entity";
import { CommentEntity } from "./comment.entity";
import { Tag } from "./tag.entity";

@Entity('work_items')
export class WorkItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titile: string;

  @Column()
  description: string; // We must change it's column type later from varchar to text!!!

  @ManyToMany(type => Tag, tag => tag.workItems)
  tags: Promise<Tag[]>;

  @ManyToOne(type => User, user => user.workItems)
  assignee: User;

  @ManyToMany(type => User, user => user.workItemsToReview)
  @JoinTable()
  reviewers: Promise<User[]>;

  @ManyToOne(type => Team, team => team.workItems)
  team: Team;

  @OneToMany(type => CommentEntity, comment => comment.workItem)
  commentSection: Promise<CommentEntity>;

  @ManyToOne(type => Status, status => status.workItems)
  status: Status;
}