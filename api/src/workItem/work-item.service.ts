import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WorkItem } from "../entities/work-item.entity";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { CreateWorkItemDTO } from "./models/create-work-item.dto";
import { AddReviwerDTO } from "./models/add-reviewer.dto";
import { ReviewerStatus } from "../entities/reviewer-status.entity";
import { Review } from "../entities/review.entity";

@Injectable()
export class WorkItemService {
  constructor(
    @InjectRepository(WorkItem)
    private readonly workItemRepository: Repository<WorkItem>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ReviewerStatus)
    private readonly reviewerStatusRepository: Repository<ReviewerStatus>,
    
  ) {}
  async createWorkItem(loggedUser: User, createWorkItemDTO: CreateWorkItemDTO){
    const reviewerDTOs: AddReviwerDTO[] = createWorkItemDTO.reviewers;
    const reviewerEntities: User[] = this.getReviewerEntities(reviewerDTOs);
    const newWorkItem: WorkItem = new WorkItem();
    newWorkItem.assignee = loggedUser;
    newWorkItem.title = newWorkItem.title;
    newWorkItem.description = createWorkItemDTO.description;
    newWorkItem.reviews = // promise.resoleve;
  }

  private createReviews(reviewers: User[]){
    const reviews: Review[] = [];
    reviewers.forEach((currentReviwer)=>{
      const newReview: Review = new Review();
      newReview.
    });
  }

  private getReviewerEntities(reviewerDTOs: AddReviwerDTO[]) :User[]{
    const reviewerEntities: User[] = [];
    reviewerDTOs.forEach(async (currentReviewerDTO)=>{
      const foundReviewerEntity = await this.userRepository.findOne({
        where: {
          id: currentReviewerDTO.id,
          isDeleted: false,
        },
      });
      reviewerEntities.push(foundReviewerEntity);
    });
    return reviewerEntities;
  }
}