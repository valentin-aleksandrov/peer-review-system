import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkItem } from '../entities/work-item.entity';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateWorkItemDTO } from './models/create-work-item.dto';
import { AddReviwerDTO } from './models/add-reviewer.dto';
import { ReviewerStatus } from '../entities/reviewer-status.entity';
import { Review } from '../entities/review.entity';
import { ShowWorkItemDTO } from './models/show-work-item.dto';
import { ShowReviewerDTO } from './models/show-reviewer.dto';
import { ShowAssigneeDTO } from './models/show-assignee.dto';
import { WorkItemStatus } from '../entities/work-item-status.entity';
import { AddTagDTO } from './models/add-tag.dto';
import { Tag } from '../entities/tag.entity';
import { ShowTagDTO } from './models/show-tag.dto';
import { Team } from '../entities/team.entity';
import { ShowTeamDTO } from 'src/team/models/show-team.dto';
import { SearchWorkItemDTO } from './models/search-work-item.dto';
import { CommentEntity } from 'src/entities/comment.entity';
import { ShowCommentDTO } from 'src/review-requests/models/show-comment.dto';
import { UsersService } from 'src/users/users.service';
import { ShowUserDTO } from 'src/users/models/show-user.dto';

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
    @InjectRepository(Team)
    private readonly teamsRepository: Repository<Team>,
    @InjectRepository(CommentEntity)
    private readonly commentsRepository: Repository<CommentEntity>,
  ) {}
  async findWorkItemById(workItemId: string): Promise<ShowWorkItemDTO> {
    const workItem: WorkItem = await this.workItemRepository.findOne({
      where: {
        id: workItemId,
      },
    });

    if (!workItem) {
      return undefined;
    }
    const reviews: Review[] = await workItem.reviews;

    return await this.convertToShowWorkItemDTO(workItem);
  }

  async createWorkItem(
    loggedUser: User,
    createWorkItemDTO: CreateWorkItemDTO,
  ): Promise<ShowWorkItemDTO> {
    const reviewerDTOs: AddReviwerDTO[] = createWorkItemDTO.reviewers;
    const reviewerEntities: User[] = await this.getReviewerEntities(
      reviewerDTOs,
    );
    const newWorkItem: WorkItem = new WorkItem();
    newWorkItem.assignee = loggedUser;
    newWorkItem.title = createWorkItemDTO.title;
    newWorkItem.description = createWorkItemDTO.description;

    const workItemReviewEntities: Review[] = await this.createReviews(
      reviewerEntities,
    );

    newWorkItem.reviews = Promise.resolve(workItemReviewEntities);
    const pendingWorkItemStatus: WorkItemStatus = await this.workItemStatusRepository.findOne(
      {
        where: {
          status: 'pending',
        },
      },
    );
    newWorkItem.workItemStatus = pendingWorkItemStatus;
    const tags = await this.findTagsByNames(createWorkItemDTO.tags);
    newWorkItem.tags = Promise.resolve(tags);
    const team: Team = await this.teamsRepository.findOne({
      where: {
        teamName: createWorkItemDTO.team,
      },
    });
    newWorkItem.team = team;
    const createdWorkItem: WorkItem = await this.workItemRepository.save(
      newWorkItem,
    );

    return this.convertToShowWorkItemDTO(createdWorkItem);
  }

  async getWorkItemsByUserId(userId: string): Promise<ShowWorkItemDTO[]> {
    const foundUser: User = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    const workItems: WorkItem[] = await this.workItemRepository.find({
      where: {
        assignee: foundUser,
      },
    });
    return this.convertToShowWorkItemDTOs(workItems);
  }
  async findWorkItemsByTeam(
    teamId: string,
    searchOptions: SearchWorkItemDTO,
  ): Promise<ShowWorkItemDTO[]> {
    const team: Team = await this.teamsRepository.findOne({
      where: {
        id: teamId,
      },
    });
    if (!team) {
      return undefined;
    }
    const teamWorkItemsIds: Set<string> = new Set<string>();
    const users: User[] = team.users;

    const createdWorkItems: WorkItem[] = await this.getWorkItemsCreatedByUsers(
      users,
    );

    let filterCreatedWorkItems: WorkItem[] = createdWorkItems.filter(
      (workItem: WorkItem) => {
        if (!searchOptions.title) {
          return true;
        }
        return workItem.title
          .toLocaleLowerCase()
          .includes(searchOptions.title.toLowerCase());
      },
    );

    if (!!searchOptions.tag) {
      filterCreatedWorkItems = await this.filterByTag(
        filterCreatedWorkItems,
        searchOptions.tag,
      );
    }
    if (!!searchOptions.reviewerName) {
      filterCreatedWorkItems = await this.filterByReviewerName(
        filterCreatedWorkItems,
        searchOptions.reviewerName,
      );
    }

    const workItemsForReviewConnectedToTeam: WorkItem[] = await this.getWokrItemReviewByUsers(
      users,
    );

    let filterReviewWorkItems: WorkItem[] = workItemsForReviewConnectedToTeam.filter(
      (workItem: WorkItem) => {
        if (!searchOptions.title) {
          return true;
        }
        return workItem.title
          .toLocaleLowerCase()
          .includes(searchOptions.title.toLowerCase());
      },
    );
    if (!!searchOptions.tag) {
      filterReviewWorkItems = await this.filterByTag(
        filterReviewWorkItems,
        searchOptions.tag,
      );
    }
    if (!!searchOptions.reviewerName) {
      filterReviewWorkItems = await this.filterByReviewerName(
        filterReviewWorkItems,
        searchOptions.reviewerName,
      );
    }

    for (const workItem of filterCreatedWorkItems) {
      teamWorkItemsIds.add(workItem.id);
    }

    for (const workItem of filterReviewWorkItems) {
      teamWorkItemsIds.add(workItem.id);
    }

    const workItems: WorkItem[] = [];
    for (const currentId of teamWorkItemsIds) {
      const foundWorkItem: WorkItem = await this.workItemRepository.findOne({
        where: {
          id: currentId,
        },
      });
      workItems.push(foundWorkItem);
    }

    return this.convertToShowWorkItemDTOs([...workItems]);
  }
  public async findAllTags(): Promise<ShowTagDTO[]> {
    const tags: Tag[] = await this.tagsRepository.find();
    return await this.convertTagstoDTOs(tags);
  }
  private async filterByReviewerName(
    workItems: WorkItem[],
    searchReviewer: string,
  ): Promise<WorkItem[]> {
    let result: WorkItem[] = [];
    for (const currentWorkItem of workItems) {
      const reviewers: Review[] = await this.reviewsRepository.find({
        where: {
          workItem: currentWorkItem,
        },
      });
      const userNames: string[] = reviewers.map(
        (rev: Review) => rev.user.username,
      );
      if (
        userNames.some(username =>
          username.toLowerCase().includes(searchReviewer.toLowerCase()),
        )
      ) {
        result.push(currentWorkItem);
      }
    }
    return result;
  }
  private async filterByTag(
    workItems: WorkItem[],
    searchedTag: string,
  ): Promise<WorkItem[]> {
    let result: WorkItem[] = [];
    for (const currentWorkItem of workItems) {
      const tags: Tag[] = await this.tagsRepository.find({
        where: {
          workItems: currentWorkItem,
        },
      });
      for (const currentTag of tags) {
        if (currentTag.name.toLowerCase().includes(searchedTag.toLowerCase())) {
          result.push(currentWorkItem);
          break;
        }
      }
    }
    return result;
  }

  private async getWokrItemReviewByUsers(users: User[]): Promise<WorkItem[]> {
    const workItems: WorkItem[] = [];
    for (const user of users) {
      const usersWorkItemsHeIsReviewing: WorkItem[] = await this.getWorkItemsByUserHisReviewing(
        user,
      );
      workItems.push(...usersWorkItemsHeIsReviewing);
    }
    return workItems;
  }

  private async getWorkItemsByUserHisReviewing(
    user: User,
  ): Promise<WorkItem[]> {
    const workItems: WorkItem[] = [];
    const reviews: Review[] = await this.reviewsRepository.find({
      where: {
        user: user,
      },
    });
    for (const review of reviews) {
      const workItem: WorkItem = review.workItem;
      const currentReviewid: string = (await workItem.reviews)[0].id;
      const review2: Review = await this.reviewsRepository.findOne({
        where: {
          id: currentReviewid,
        },
      });
      workItems.push(workItem);
    }
    return workItems;
  }
  private async getWorkItemsCreatedByUsers(users: User[]): Promise<WorkItem[]> {
    const workItems: WorkItem[] = [];
    for (const user of users) {
      const currentUserWorkItems: WorkItem[] = await this.workItemRepository.find(
        {
          where: {
            assignee: user,
          },
        },
      );

      workItems.push(...currentUserWorkItems);
    }
    return workItems;
  }
  private async convertToShowWorkItemDTOs(
    workItems: WorkItem[],
  ): Promise<ShowWorkItemDTO[]> {
    return Promise.all(
      workItems.map(async (entity: WorkItem) =>
        this.convertToShowWorkItemDTO(entity),
      ),
    );
  }
  private async createReviews(reviewers: User[]): Promise<Review[]> {
    let reviews: Review[] = [];
    const pendingReviewerStatus = await this.reviewerStatusRepository.findOne({
      where: {
        status: 'pending',
      },
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

  private async findTagsByNames(tagNames: AddTagDTO[]): Promise<Tag[]> {
    let tags: Tag[] = [];
    for (const currentTagDTO of tagNames) {
      const tagName = currentTagDTO.name;
      const currentTagEntity = await this.tagsRepository.findOne({
        where: {
          name: tagName,
        },
      });
      tags = [...tags, currentTagEntity];
    }
    return tags;
  }
  private getReviewerEntities(reviewerDTOs: AddReviwerDTO[]): Promise<User[]> {
    if (!reviewerDTOs) {
      return Promise.resolve([]);
    }
    const reviewerEntities: User[] = [];
    reviewerDTOs.forEach(async (currentReviewerDTO: AddReviwerDTO) => {
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
  private async convertToShowReviewerDTO(
    reviewer: Review,
  ): Promise<ShowReviewerDTO> {
    const userEntity: User = await this.userRepository.findOne({
      where: {
        reviews: reviewer,
      },
    });
    const review = await this.reviewsRepository.findOne({
      where: {
        id: reviewer.id,
      },
    });
    const status = review.reviewerStatus;
    const convertedReviewer: ShowReviewerDTO = {
      id: userEntity.id,
      email: userEntity.email,
      status: status.status,
      username: userEntity.username,
    };
    return convertedReviewer;
  }
  private async convertToShowReviewerDTOArray(
    reviewers: Review[],
  ): Promise<ShowReviewerDTO[]> {
    if (!reviewers) {
      return [];
    }
    return Promise.all(
      reviewers.map(async (entity: Review) =>
        this.convertToShowReviewerDTO(entity),
      ),
    );
  }

  private async convertToShowWorkItemDTO(
    workItem: WorkItem,
  ): Promise<ShowWorkItemDTO> {
    if (!workItem) {
      return new ShowWorkItemDTO();
    }
    const showReviewersDTO: ShowReviewerDTO[] = await this.convertToShowReviewerDTOArray(
      await workItem.reviews,
    );

    if (!showReviewersDTO) {
      return new ShowWorkItemDTO();
    }
    if (!workItem.assignee) {
      return new ShowWorkItemDTO();
    }

    const assigneeDTO: ShowAssigneeDTO = {
      id: workItem.assignee.id,
      email: workItem.assignee.email,
      username: workItem.assignee.username,
    };
    const tagDTOs: ShowTagDTO[] = this.convertTagstoDTOs(await workItem.tags);
    const comments: CommentEntity[] = await this.commentsRepository.find({
      where: {
        workItem: workItem,
      },
    });
    const commentDTOs: ShowCommentDTO[] = await this.convertToCommentDTOs(
      comments,
    );
    const convertedWorkItem: ShowWorkItemDTO = {
      id: workItem.id,
      isReady: workItem.isReady,
      title: workItem.title,
      description: workItem.description,
      assignee: assigneeDTO,
      reviews: showReviewersDTO,
      workItemStatus: workItem.workItemStatus.status,
      tags: tagDTOs,
      team: workItem.team.teamName,
      comments: commentDTOs,
    };
    return convertedWorkItem;
  }
  private convertTagstoDTOs(tags: Tag[]): ShowTagDTO[] {
    return tags.map(
      (tagEntity: Tag): ShowTagDTO => ({
        id: tagEntity.id,
        name: tagEntity.name,
      }),
    );
  }
  private async convertToCommentDTO(
    comment: CommentEntity,
  ): Promise<ShowCommentDTO> {
    const author: ShowUserDTO = await this.convertToShowUserDTO(comment.author);
    const commentDTO: ShowCommentDTO = {
      id: comment.id,
      content: comment.content,
      author: author,
    };
    return commentDTO;
  }

  private async convertToCommentDTOs(
    comments: CommentEntity[],
  ): Promise<ShowCommentDTO[]> {
    if (!comments) {
      return [];
    }
    return Promise.all(
      comments.map(async (entity: CommentEntity) =>
        this.convertToCommentDTO(entity),
      ),
    );
  }
  private async convertToShowUserDTO(user: User): Promise<ShowUserDTO> {
    const convertedUser: ShowUserDTO = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: (await user.role).name,
      avatarURL: user.avatarURL,
    };
    return convertedUser;
  }
}
