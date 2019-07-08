import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('files')
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}