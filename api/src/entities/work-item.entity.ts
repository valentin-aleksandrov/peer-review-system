import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { User } from "./user.entity";
import { Status } from "./status.entity";

@Entity('work_items')
export class WorkItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titile: string;

  @Column()
  description: string; // We must change it's column type later from varchar to text!!!

  @Column()
  tags: string; // Need more research of what tags are!

  @ManyToOne(type => User, user => user.workItems)
  assignee: User;

  @ManyToMany(type => User, user => user.workItemsToReview)
  @JoinTable()
  reviewers: Promise<User[]>;

  comments: string[];

  section: string; // It needs more research what a section means!

  status: Status;








/*
  @Column()
  name: string;

  @ManyToMany(type => User, user => user.teams)
  @JoinTable()
  users: Promise<User[]>;
  */
}