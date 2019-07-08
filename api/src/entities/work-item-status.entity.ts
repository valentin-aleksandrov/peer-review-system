import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { WorkItem } from "./work-item.entity";

@Entity('work_item_statuses')
export class WorkItemStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  status: string;

  @OneToMany(type => WorkItem, workItem => workItem.workItemStatus)
  workItems: Promise<WorkItem[]>;
}