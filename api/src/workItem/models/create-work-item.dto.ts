import { IsString, Length } from "class-validator";
import { AddReviwerDTO } from "./add-reviewer.dto";

export class CreateWorkItemDTO {
    @IsString()
    @Length(1, 60)
    title: string;
  
    @IsString()
    @Length(1, 100000)
    description: string;

    reviewers: AddReviwerDTO[];
  }
  