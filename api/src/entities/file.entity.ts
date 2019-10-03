import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { WorkItem } from "./work-item.entity";

@Entity('files')
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @Column('nvarchar')
  fileName: string;

  @Column('nvarchar')
  url: string;

  @ManyToOne(type => WorkItem, workItem => workItem.files, {
    eager: true,
  })
  workItem: WorkItem;
}