import { Tag } from "./tag";
import { Review } from "./review";
import { Assignee } from "./assinee";
import { Comment } from "./comment";

export class WorkItem {
  id: string;

  isReady: boolean;

  title: string;

  description: string;

  author: Assignee;

  workItemStatus: string;

  reviews: Review[];

  tags: Tag[];

  team: string;

  comments: Comment[];
}
