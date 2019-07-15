import { IsString } from "class-validator";
import { Expose } from "class-transformer";
import { ShowUserDTO } from "src/users/models/show-user.dto";
import { stat } from "fs";
import { AddCommentDTO } from "./add-comment.dto";


export class ChangeReviewStatusDTO {

  @Expose() 
  @IsString()
  status: string;

  @Expose() 
  @IsString()
  content: string;

}