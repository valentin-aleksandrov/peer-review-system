import { IsString } from "class-validator";
import { Expose } from "class-transformer";
import { TeamInvitationStatus } from "src/entities/team-invitation-status.entity";
import { User } from "src/entities/user.entity";
import { Team } from "src/entities/team.entity";
import { ShowUserDTO } from "src/users/models/show-user.dto";
import { ShowTeamDTO } from "src/team/models/show-team.dto";
import { ShowTeamInvitationStatusDTO } from "./team-invitation-status.dto";


export class ShowTeamInvitationDTO {
  
  @Expose()
  id; string;

  @Expose()
  @IsString()
  team: ShowTeamDTO;

  @Expose()
  @IsString()
  invitee: ShowUserDTO;

  @Expose()
  @IsString()
  host: ShowUserDTO;

  @Expose()
  status: ShowTeamInvitationStatusDTO;

}