
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToMany,
  OneToMany, 
} from 'typeorm';
import { Team } from './team.entity';
import { Role } from './role.entity';
import { type } from 'os';
import { WorkItem } from './work-item.entity';
import { CommentEntity } from './comment.entity';


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

  @ManyToMany(type => Team, team => team.members)
  teams: Promise<Team[]>;

  @ManyToMany(type => Role, role => role.users)
  roles: Role[];

  @OneToMany(type => WorkItem, workitem => workitem.assignee)
  workItems: Promise<WorkItem[]>;

  @ManyToMany(type => WorkItem, workItem => workItem.reviewers)
  workItemsToReview: WorkItem[];

  @OneToMany(type => CommentEntity, comment => comment.author)
  comments: Promise<CommentEntity[]>;
}
