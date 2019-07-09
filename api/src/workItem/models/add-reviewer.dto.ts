import { IsString, Length } from "class-validator";

export class AddReviwerDTO {
    @IsString()
    @Length(1, 100)
    id: string;
  
    @IsString()
    @Length(4, 60)
    email: string;
  }