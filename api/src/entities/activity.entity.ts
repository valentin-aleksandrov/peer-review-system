import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Activity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    activity: string;

    @CreateDateColumn()
    dateCreated: Date;

    @ManyToOne(type => User, user => user.activity, {
        eager: true,
      })
    user: User;


}
