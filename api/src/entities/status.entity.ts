import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { WorkItem } from "./work-item.entity";

@Entity('statuses')
export class Status {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  state: string;

  workItems: WorkItem[];
}