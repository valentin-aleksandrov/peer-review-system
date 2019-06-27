
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToMany, 
  OneToMany, 
  CreateDateColumn, 
  UpdateDateColumn, 
  JoinTable 
} from 'typeorm';


@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('nvarchar')
  username: string;

  @Column('nvarchar', {unique: true})
  email: string;

  @Column('nvarchar')
  password: string;

  @Column('nvarchar')
  firstName: string;

  @Column('nvarchar')
  lastName: string; 

  @Column({default: false})
  isDeleted: boolean;
}
