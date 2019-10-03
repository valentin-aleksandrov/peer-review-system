import { Tag } from "./tag";
import { Review } from "./review";
import { Assignee } from "./assinee";
import { Comment } from "./comment";
import { FileEntity } from './file-entity';

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

  files: FileEntity[];
}
