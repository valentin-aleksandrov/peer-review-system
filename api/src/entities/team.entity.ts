import { 
    Entity, 
    PrimaryGeneratedColumn, 
    ManyToMany, 
    JoinTable 
} from "typeorm";
import { User } from "./user.entity";
import { Role } from "./role.entity";

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(type => User, user => user.teams)
  @JoinTable()
  users: Promise<User[]>;
}