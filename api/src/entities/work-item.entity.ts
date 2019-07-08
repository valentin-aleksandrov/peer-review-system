import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { WorkItemStatus } from "./work-item-status.entity";
import { Tag } from "./tag.entity";

@Entity('work_items')
export class WorkItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => WorkItemStatus, status => status.workItems)
  workItemStatus: WorkItemStatus;

  @ManyToMany(type => Tag, tag => tag.workItems)
  @JoinTable()
  tags: Promise<Tag[]>;
}