import { Expose } from "class-transformer";
import { IsString } from "class-validator";
import { ShowUserDTO } from "src/users/models/show-user.dto";
import { ShowReviewStatusDTO } from "./show-review-status.dto";


export class ShowReviewDTO {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsString()
  reviewStatus: ShowReviewStatusDTO;

  
  @Expose()
  @IsString()
  user: ShowUserDTO;
}