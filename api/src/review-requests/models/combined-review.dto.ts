import { Expose } from "class-transformer";
import { ShowCommentDTO } from "./show-comment.dto";
import { ShowReviewDTO } from "./show-review.dto";


export class CombinedReviewDTO {
  @Expose()
  review: ShowReviewDTO;

  @Expose()
  comment: ShowCommentDTO;
}