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
import { WorkItemStatus } from "../entities/work-item-status.entity";
import { AddTagDTO } from "./models/add-tag.dto";
import { Tag } from "../entities/tag.entity";
import { ShowTagDTO } from "./models/show-tag.dto";

@Injectable()
export class WorkItemService {
  constructor(
    @InjectRepository(WorkItem)
    private readonly workItemRepository: Repository<WorkItem>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ReviewerStatus)
    private readonly reviewerStatusRepository: Repository<ReviewerStatus>,
    @InjectRepository(WorkItemStatus)
    private readonly workItemStatusRepository: Repository<WorkItemStatus>,
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
    
  ) {}
  async createWorkItem(loggedUser: User, createWorkItemDTO: CreateWorkItemDTO)
    : Promise<ShowWorkItemDTO>{
    const reviewerDTOs: AddReviwerDTO[] = createWorkItemDTO.reviewers;
    const reviewerEntities: User[] = await this.getReviewerEntities(reviewerDTOs);
    const newWorkItem: WorkItem = new WorkItem();
    newWorkItem.assignee = loggedUser;
    newWorkItem.title = createWorkItemDTO.title;
    newWorkItem.description = createWorkItemDTO.description;

    const workItemReviewEntities: Review[] = await this.createReviews(reviewerEntities);

    newWorkItem.reviews = workItemReviewEntities;
    const pendingWorkItemStatus: WorkItemStatus = await this.workItemStatusRepository
      .findOne({
        where: {
          status: 'pending',
        }
      });
    newWorkItem.workItemStatus = pendingWorkItemStatus;
    const tags = await this.findTagsByNames(createWorkItemDTO.tags);
    newWorkItem.tags = Promise.resolve(tags);
    const createdWorkItem: WorkItem = await this.workItemRepository.save(newWorkItem);
    
    return this.convertToShowWorkItemDTO(createdWorkItem);
  }

  private async createReviews(reviewers: User[]) :Promise<Review[]>{
    let reviews: Review[] = [];
    const pendingReviewerStatus = await this.reviewerStatusRepository
      .findOne({
        where: {
          status: 'pending'
        }
      });

    // reviewers.foreach will not work, because we have a async call to a repository!
    for (const currentReviwer of reviewers) {
      const newReview: Review = new Review();
      newReview.user = currentReviwer;
      newReview.reviewerStatus = pendingReviewerStatus;
      
      const saveRev = await this.reviewsRepository.save(newReview);
      
      reviews = [...reviews, saveRev];
    }
    
    return reviews;
  }

  private async findTagsByNames(tagNames: AddTagDTO[]): Promise<Tag[]>{
    let tags: Tag[] = [];
    for (const currentTagDTO of tagNames) {
      const tagName = currentTagDTO.name;
      const currentTagEntity = await this.tagsRepository
        .findOne({
          where: {
            name: tagName,
          }
        });
      tags = [...tags,currentTagEntity];
    }
    return tags;
  }
  private getReviewerEntities(reviewerDTOs: AddReviwerDTO[]) :Promise<User[]>{
    if(!reviewerDTOs){
      return Promise.resolve([]);
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
    return Promise.resolve(reviewerEntities);
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
    const tagDTOs: ShowTagDTO[] = this.convertTagstoDTOs(await workItem.tags);
    const convertedWorkItem: ShowWorkItemDTO = {
      id: workItem.id,
      isReady: workItem.isReady,
      title: workItem.title,
      description: workItem.description,
      assignee: assigneeDTO,
      reviews: showReviewersDTO,
      workItemStatus: workItem.workItemStatus.status,
      tags: tagDTOs,
    };
    return convertedWorkItem;
  }
  private convertTagstoDTOs(tags: Tag[]): ShowTagDTO[]{
    return tags.map((tagEntity :Tag) :ShowTagDTO => ({
      id: tagEntity.id,
      name: tagEntity.name,
    }));
  }
}