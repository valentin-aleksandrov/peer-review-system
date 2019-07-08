import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Review } from "./review.entity";

@Entity('reviewer_statuses')
export class ReviewerStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  status: string;

  @OneToMany(type => Review, review => review.reviewerStatus)
  reviews: Promise<Review[]>;
}