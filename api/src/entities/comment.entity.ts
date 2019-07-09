import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Review } from "./review.entity";

@Entity('comments')
export class CommentEntity { // 'Comment' is not a free indentifiactor.
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('nvarchar') 
  content: string;

  @ManyToOne((type) => Review, (review) => review.comments)
  review: Promise<Review>;
}
