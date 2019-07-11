import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WorkItem } from "../entities/work-item.entity";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { CreateWorkItemDTO } from "./models/create-work-item.dto";
import { AddReviwerDTO } from "./models/add-reviewer.dto";
import { ReviewerStatus } from "../entities/reviewer-status.entity";
import { Review } from "../entities/review.entity";
import { create } from "domain";

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
    newWorkItem.title = createWorkItemDTO.title;
    newWorkItem.description = createWorkItemDTO.description;
    newWorkItem.reviews = Promise.resolve( await this.createReviews(reviewerEntities));
    const createdWorkItem = await this.workItemRepository.save(newWorkItem);
    
    console.log("created workItem -> ", (await createdWorkItem.reviews));
    
  }

  private async createReviews(reviewers: User[]) :Promise<Review[]>{
    const reviews: Review[] = [];
    const pendingReviewerStatus = await this.reviewerStatusRepository
      .findOne({
        where: {
          status: 'pending'
        }
      });
    reviewers.forEach((currentReviwer)=>{
      const newReview: Review = new Review();
      newReview.user = Promise.resolve(currentReviwer);
      newReview.reviewerStatus = pendingReviewerStatus;
      reviews.push(newReview);
    });
    return reviews;
  }

  private getReviewerEntities(reviewerDTOs: AddReviwerDTO[]) :User[]{
    if(!reviewerDTOs){
      return [];
    }
    const reviewerEntities: User[] = [];
    reviewerDTOs.forEach(async (currentReviewerDTO)=>{
      const foundReviewerEntity = await this.userRepository.findOne({
        where: {
          username: currentReviewerDTO.username,
          isDeleted: false,
        },
      });
      reviewerEntities.push(foundReviewerEntity);
    });
    return reviewerEntities;
  }
}