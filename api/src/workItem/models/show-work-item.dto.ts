import { ShowAssigneeDTO } from "./show-assignee.dto";
import { ShowReviewValDTO } from "./show-reviewer.dto";
import { ShowTagDTO } from "./show-tag.dto";
import { ShowCommentDTO } from "src/review-requests/models/show-comment.dto";
import { Expose } from "class-transformer";
import { ChangeWorkItemStatus } from "./change-work-item-status.dto";
import { ShowTeamDTO } from "src/team/models/show-team.dto";

export class ShowWorkItemDTO {
  @Expose()
  id: string;

  @Expose()
  isReady: boolean;
  @Expose()
  title: string;
  @Expose()
  description: string;
  @Expose()
  author: ShowAssigneeDTO;
  @Expose()
  workItemStatus: ChangeWorkItemStatus;
  @Expose()
  reviews: ShowReviewValDTO[];
  @Expose()
  tags: ShowTagDTO[];
  @Expose()
  team: ShowTeamDTO;
  @Expose()
  comments: ShowCommentDTO[];
}
