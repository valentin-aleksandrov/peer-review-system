import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { TeamInvitation } from "./team-invitation.entity";
import { string } from "joi";

@Entity('team_invitation_status')
export class TeamInvitationStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  status: string;

  @OneToMany(type => TeamInvitation, teamInivitation => teamInivitation.status)
  TeamInvitation: Promise<TeamInvitation>;
}