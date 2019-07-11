import { IsString, Length } from "class-validator";
import { AddReviwerDTO } from "./add-reviewer.dto";
import { AddTagDTO } from "./add-tag.dto";

export class CreateWorkItemDTO {
    @IsString()
    @Length(1, 60)
    title: string;
  
    @IsString()
    @Length(1, 100000)
    description: string;

    reviewers: AddReviwerDTO[];

    tags: AddTagDTO[];
  }
  