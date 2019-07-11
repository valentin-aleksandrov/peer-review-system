import { ShowAssigneeDTO } from "./show-assignee.dto";
import { ShowReviewerDTO } from "./show-reviewer.dto";
import { ShowTagDTO } from "./show-tag.dto";

export class ShowWorkItemDTO {
    id: string;

    isReady: boolean;
    
    title: string;
  
    description: string;
  
    assignee: ShowAssigneeDTO;
  
    workItemStatus: string;
  
    reviews: ShowReviewerDTO[];

    tags: ShowTagDTO[];
}