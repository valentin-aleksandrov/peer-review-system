import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('work_item_statuses')
export class WorkItemStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  status: string;
}