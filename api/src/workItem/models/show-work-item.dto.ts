import { ShowAssigneeDTO } from "./show-assignee.dto";
import { ShowReviewerDTO } from "./show-reviewer.dto";

export class ShowWorkItemDTO {
    id: string;

    isReady: boolean;
    
    title: string;
  
    description: string;
  
    assignee: ShowAssigneeDTO;
  
    workItemStatus: string;
  
    reviews: Promise<ShowReviewerDTO[]>;
}