import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Team } from "./team.entity";

@Entity()
export class TeamRules {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    minPercentApprovalOfItem: number;

    @Column()
    minNumberOfReviewers: number;

    @OneToMany( type => Team, team => team.rules)
    team: Promise<Team[]>;


}
