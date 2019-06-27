import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { WorkItem } from "./work-item.entity";

@Entity('statuses')
export class Status {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  state: string;

  @OneToMany(type => WorkItem, workItem => workItem.status)
  workItems: Promise<WorkItem[]>;
}