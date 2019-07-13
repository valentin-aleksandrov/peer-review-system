import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { WorkItem } from "./work-item.entity";
import { ReviewerStatus } from "./reviewer-status.entity";
import { CommentEntity } from "./comment.entity";
import { User } from "./user.entity";

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => WorkItem, workItem => workItem.reviews, {
    eager: true,
  })
  workItem: WorkItem;

  @ManyToOne(type => ReviewerStatus, status => status.reviews, {
    eager: true,
  })
  reviewerStatus: ReviewerStatus;

  @OneToMany((type) => CommentEntity, (comment) => comment.review)
  comments: Promise<CommentEntity>;

  @ManyToOne((type) => User, (user) => user.reviews, {
    eager: true,
  })
  user: User;
}