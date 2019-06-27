import { 
    Entity, 
    PrimaryGeneratedColumn, 
    ManyToMany, 
    JoinTable, 
    Column
} from "typeorm";
import { User } from "./user.entity";
import { Role } from "./role.entity";

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(type => User, user => user.teams)
  @JoinTable()
  users: Promise<User[]>;
}