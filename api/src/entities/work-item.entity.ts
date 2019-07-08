import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('work_items')
export class WorkItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}