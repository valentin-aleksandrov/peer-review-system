import { 
    Entity, 
    PrimaryGeneratedColumn, 
    ManyToMany, 
    JoinTable, 
    Column,
    OneToMany
} from "typeorm";
import { User } from "./user.entity";
import { Role } from "./role.entity";
import { WorkItem } from "./work-item.entity";

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(type => User, user => user.teams)
  @JoinTable()
  members: Promise<User[]>;

  @OneToMany(type => WorkItem, workItem => workItem.team)
  workItems: Promise<WorkItem>;
}