import { IsString, Length, ValidateNested } from "class-validator";
import { ShowUserDTO } from "src/users/models/show-user.dto";
import { TeamRules } from "src/entities/team-rules.entity";
import { Expose } from "class-transformer";
import { TeamInvitation } from "src/entities/team-invitation.entity";
import { TeamRuleDTO } from "./team-rule.dto";

export class ShowTeamDTO {
  
  @Expose()
  @IsString()
  @Length(1, 20)
  teamName: string;

  @IsString()
  @Expose()
  users: ShowUserDTO;

  @Expose()
  @IsString()
  id: string;

  @Expose()
  @ValidateNested()
  rules: TeamRuleDTO;
  
  @Expose()
  teamInvitation: TeamInvitation;


  

}