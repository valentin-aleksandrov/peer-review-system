import { IsString } from "class-validator";

export class AddTeamInvitationDTO {
  
  @IsString()
  teamName: string;

  @IsString()
  inviteeName: string;

}