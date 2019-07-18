import { IsString, Length, ValidateNested } from "class-validator";
import { TeamRuleDTO } from "./team-rule.dto";

export class CreateTeamDTO {
  
  @IsString()
  @Length(4, 20)
  teamName: string;

  @ValidateNested()
  rule: TeamRuleDTO;

}