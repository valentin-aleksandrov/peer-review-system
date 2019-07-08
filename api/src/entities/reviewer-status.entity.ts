import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('reviewer-statuses')
export class ReviewerStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  status: string;
}