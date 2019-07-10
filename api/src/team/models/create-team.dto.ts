import { IsString, Length } from "class-validator";

export class CreateTeamDTO {
  
  @IsString()
  @Length(1, 20)
  teamName: string;

  

}