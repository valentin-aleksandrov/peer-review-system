import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { url } from "inspector";

@Entity('pictures')
export class Picture {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;
}