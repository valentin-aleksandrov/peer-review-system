import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { WorkItem } from "./work-item.entity";

@Entity('files')
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => WorkItem, workItem => workItem.files)
  workItem: Promise<WorkItem>;
}