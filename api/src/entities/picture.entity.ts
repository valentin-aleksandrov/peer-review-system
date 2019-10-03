import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { url } from "inspector";
import { WorkItem } from "./work-item.entity";
import { type } from "os";

@Entity('pictures')
export class Picture {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @ManyToOne(type => WorkItem, workItem => workItem.pictures)
  workItem: Promise<WorkItem>;
}