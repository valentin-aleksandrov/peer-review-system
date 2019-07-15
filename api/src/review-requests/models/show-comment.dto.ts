import { IsString } from "class-validator";
import { Expose } from "class-transformer";
import { ShowUserDTO } from "src/users/models/show-user.dto";


export class ShowCommentDTO {

   @Expose() 
  @IsString()
  id: string;
  
  @Expose()
  @IsString()
  content: string;

  @Expose()
  author: ShowUserDTO;

}