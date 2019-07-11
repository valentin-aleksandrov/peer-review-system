import { IsString, Length } from "class-validator";

export class AddReviwerDTO {
    @IsString()
    @Length(1, 60)
    username: string;
  }