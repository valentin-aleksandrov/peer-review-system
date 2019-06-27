
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToMany, 
} from 'typeorm';
import { Team } from './team.entity';


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

  @ManyToMany(type => Team, team => team.users)
  teams: Promise<Team[]>;
}
