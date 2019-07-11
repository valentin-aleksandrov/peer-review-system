import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WorkItem } from "../entities/work-item.entity";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { CreateWorkItemDTO } from "./models/create-work-item.dto";
import { AddReviwerDTO } from "./models/add-reviewer.dto";
import { ReviewerStatus } from "../entities/reviewer-status.entity";
import { Review } from "../entities/review.entity";
import { ShowWorkItemDTO } from "./models/show-work-item.dto";
import { ShowReviewerDTO } from "./models/show-reviewer.dto";
import { ShowAssigneeDTO } from "./models/show-assignee.dto";

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
  async createWorkItem(loggedUser: User, createWorkItemDTO: CreateWorkItemDTO)
    : Promise<ShowWorkItemDTO>{
    const reviewerDTOs: AddReviwerDTO[] = createWorkItemDTO.reviewers;
    const reviewerEntities: User[] = this.getReviewerEntities(reviewerDTOs);
    const newWorkItem: WorkItem = new WorkItem();
    newWorkItem.assignee = loggedUser;
    newWorkItem.title = createWorkItemDTO.title;
    newWorkItem.description = createWorkItemDTO.description;
    newWorkItem.reviews = Promise.resolve( await this.createReviews(reviewerEntities));
    const createdWorkItem = await this.workItemRepository.save(newWorkItem);
    return this.convertToShowWorkItemDTO(createdWorkItem);
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
    reviewerDTOs.forEach(async (currentReviewerDTO: AddReviwerDTO)=>{
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
  private async convertToShowReviewerDTO(reviewer: Review): Promise<ShowReviewerDTO> {
    const userEntity: User = await reviewer.user;

    const convertedReviewer: ShowReviewerDTO = {
      id: userEntity.id,
      email: userEntity.email,
      status: reviewer.reviewerStatus.status,
      username: userEntity.username,
    };
    return Promise.resolve(convertedReviewer);
  }
  private async convertToShowReviewerDTOArray(reviewers: Review[]): Promise<ShowReviewerDTO[]> {
    return Promise.all(reviewers.map(async (entity: Review) => this.convertToShowReviewerDTO(entity)));
}

  private async convertToShowWorkItemDTO(workItem: WorkItem): Promise<ShowWorkItemDTO> {
    const showReviewersDTO: ShowReviewerDTO[] = await this.convertToShowReviewerDTOArray(await workItem.reviews);
    const assigneeDTO: ShowAssigneeDTO = {
      id: workItem.assignee.id,
      email: workItem.assignee.email,
      username: workItem.assignee.username,
    };
    const convertedWorkItem: ShowWorkItemDTO = {
      id: workItem.id,
      isReady: workItem.isReady,
      title: workItem.title,
      description: workItem.description,
      assignee: assigneeDTO,
      reviews: Promise.resolve(showReviewersDTO),
      workItemStatus: null, //workItem.workItemStatus.status,
    };
    return convertedWorkItem;
  }
}