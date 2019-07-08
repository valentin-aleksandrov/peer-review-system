import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}