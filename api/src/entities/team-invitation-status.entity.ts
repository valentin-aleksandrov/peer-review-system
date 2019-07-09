import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { TeamInvitation } from "./team-invitation.entity";

@Entity('team-invitation-status')
export class TeamInvitationStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(type => TeamInvitation, teamInivitation => teamInivitation.status)
  status: string;
}