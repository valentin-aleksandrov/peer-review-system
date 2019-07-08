import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { WorkItem } from "./work-item.entity";

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(type => WorkItem, workItem => workItem.tags)
  workItems: Promise<WorkItem[]>;
}