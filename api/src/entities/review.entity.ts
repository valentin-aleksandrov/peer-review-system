import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { WorkItem } from "./work-item.entity";

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => WorkItem, workItem => workItem.reviews)
  workItem: Promise<WorkItem>;
}