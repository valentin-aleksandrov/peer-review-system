import { IsString, Length, ValidateNested } from "class-validator";
import { TeamRuleDTO } from "./team-rule.dto";
import { Type } from "class-transformer";

export class CreateTeamDTO {
  
  @IsString()
  @Length(4, 20)
  teamName: string;

  @ValidateNested()
  @Type(() => TeamRuleDTO) 
  rule: TeamRuleDTO;

}