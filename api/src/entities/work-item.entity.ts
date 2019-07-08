import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { WorkItemStatus } from "./work-item-status.entity";
import { Tag } from "./tag.entity";
import { Review } from "./review.entity";

@Entity('work_items')
export class WorkItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => WorkItemStatus, status => status.workItems)
  workItemStatus: WorkItemStatus;

  @ManyToMany(type => Tag, tag => tag.workItems)
  @JoinTable()
  tags: Promise<Tag[]>;

  @OneToMany(type => Review, review => review.workItem)
  reviews: Promise<Review[]>;
}