import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { WorkItemStatus } from "./work-item-status.entity";

@Entity('work_items')
export class WorkItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => WorkItemStatus, status => status.workItems)
  workItemStatus: WorkItemStatus;
}