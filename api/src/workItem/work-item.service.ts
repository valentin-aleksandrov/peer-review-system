import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WorkItem } from "../entities/work-item.entity";
import { Repository, getRepository } from "typeorm";
import { User } from "../entities/user.entity";
import { CreateWorkItemDTO } from "./models/create-work-item.dto";
import { AddReviwerDTO } from "./models/add-reviewer.dto";
import { ReviewerStatus } from "../entities/reviewer-status.entity";
import { Review } from "../entities/review.entity";
import { ShowWorkItemDTO } from "./models/show-work-item.dto";
import { ShowReviewValDTO } from "./models/show-reviewer.dto";
import { ShowAssigneeDTO } from "./models/show-assignee.dto";
import { WorkItemStatus } from "../entities/work-item-status.entity";
import { AddTagDTO } from "./models/add-tag.dto";
import { Tag } from "../entities/tag.entity";
import { ShowTagDTO } from "./models/show-tag.dto";
import { Team } from "../entities/team.entity";
import { ShowTeamDTO } from "src/team/models/show-team.dto";
import { SearchWorkItemDTO } from "./models/search-work-item.dto";
import { CommentEntity } from "src/entities/comment.entity";
import { ShowCommentDTO } from "src/review-requests/models/show-comment.dto";
import { UsersService } from "src/users/users.service";
import { ShowUserDTO } from "src/users/models/show-user.dto";
import { ChangeWorkItemStatus } from "./models/change-work-item-status.dto";
import { TeamRules } from "src/entities/team-rules.entity";
import { EmailService } from "src/notifications/email.service";
import { PushNotificationService } from "src/notifications/push-notification.service";
import { WorkItemModule } from "./work-item.module";
import { WorkItemQueryDTO } from "./models/workitem-query.dto";
import { plainToClass } from "class-transformer";
import { ShowWorkItemStatusDTO } from "./models/show-workitem-status.dto";
import { EditWorkItemDTO } from "./models/edit-work-item.dto";
import { Role } from "src/entities/role.entity";
import { FileEntity } from "src/entities/file.entity";

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
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly emailService: EmailService,
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  public async attachedFilesToWorkItem(fileNames: string[], workItemId: string): Promise<ShowWorkItemDTO> {
    const foundWorkItem: WorkItem = await this.workItemRepository.findOne({
      where: {
        id: workItemId,
      }
    });
    if(!foundWorkItem){
      return null;
    }
    let savedFiles: FileEntity[] = [];
    for (const fileName of fileNames) {
      const newFile: FileEntity = new FileEntity();
      newFile.fileName = fileName;
      const serverPath: string = 'http://localhost:3000/api/files';
      const dir = `${serverPath}/uploads/${workItemId}`;
      newFile.url = `${dir}/${fileName}`;
      const savedFile: FileEntity = await this.fileRepository.save(newFile);

      savedFiles = [savedFile,...savedFiles];
    }
    foundWorkItem.files = Promise.resolve(savedFiles);
    const updatedWorkItem: WorkItem = await this.workItemRepository.save(foundWorkItem); 
    const updatedShowWorkItemDTO: ShowWorkItemDTO = await this.convertToShowWorkItemDTO(updatedWorkItem);
    return updatedShowWorkItemDTO;
  }


  async changeWorkItemStatus(
    workItemId: string,
    newStatus: ChangeWorkItemStatus,
    user: User,
  ): Promise<ShowWorkItemDTO> {
    const foundWorkItem: WorkItem = await this.workItemRepository.findOne({
      where: {
        id: workItemId,
      },
    });
    if (!foundWorkItem) {
      return undefined;
    }
    const foundNewStatus: WorkItemStatus = await this.workItemStatusRepository.findOne(
      {
        where: {
          status: newStatus.status,
        },
      },
    );
    if (!foundNewStatus) {
      return undefined;
    }
    if (foundNewStatus.status === "accepted") {
      const workItemTeam: Team = foundWorkItem.team;
      const teamRule: TeamRules = workItemTeam.rules;
      const reviews: Review[] = await this.reviewsRepository.find({
        where: {
          workItem: foundWorkItem,
        },
      });
      const minPercentageApprove: number = teamRule.minPercentApprovalOfItem;
      const totalReviews: number = reviews.length;
      const approveReviewsCount: number = reviews
        .map((review: Review) => review.reviewerStatus.status)
        .filter(status => status === "accepted").length;

      const currentPercentageAccepted: number = this.calculatePercentage(
        totalReviews,
        approveReviewsCount,
      );

      if (currentPercentageAccepted < minPercentageApprove) {
        return undefined;
      } else {
        foundWorkItem.workItemStatus = foundNewStatus;
      }
    } else {
      foundWorkItem.workItemStatus = foundNewStatus;
    }
    const updatedWorkItem: WorkItem = await this.workItemRepository.save(
      foundWorkItem,
    );
    return await this.convertToShowWorkItemDTO(updatedWorkItem);
  }
  private async notifyForEditedWorkItem(updatedWorkItem: WorkItem): Promise<void> {
    const link: string = `http://localhost:4200/pullRequests/${updatedWorkItem.id}`;
    const reviews: Review[] = await updatedWorkItem.reviews;
    let reviewsLoaded: Review[] = [];
    for (const currentReview of reviews) {
      const foundReviewer: Review = await this.reviewsRepository.findOne({
        where: {
          id: currentReview.id,
        }
      });
      if(foundReviewer){
        reviewsLoaded = [foundReviewer,...reviewsLoaded];
      }
    }
    this.notifyUserForEditedWorkItem(updatedWorkItem.author,updatedWorkItem,link);
    reviewsLoaded
      .map((review: Review)=>review.user)
      .forEach((user: User)=>this.notifyUserForEditedWorkItem(user,updatedWorkItem,link));
  }
  
  private notifyUserForEditedWorkItem(user: User, workItem: WorkItem, link: string): void {
    this.emailService.sendEmail(
      user.email,
      'Work Item is edited',
      `${workItem.title} is edited. Press here:${link}`
    );
    this.pushNotificationService.sendPushNotfication(
      'Work Item is edited',
      `${workItem.title} is edited. Press here:`,
      user.username,
      link
    );
  }

  private calculatePercentage(
    totalReviews: number,
    approveReviewsCount: number,
  ): number {
    if (totalReviews === 0) {
      return 0;
    }
    return (approveReviewsCount / totalReviews) * 100;
  }
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
    newWorkItem.author = loggedUser;
    newWorkItem.title = createWorkItemDTO.title;
    newWorkItem.description = createWorkItemDTO.description;

    const workItemReviewEntities: Review[] = await this.createReviews(
      reviewerEntities,
    );

    newWorkItem.reviews = Promise.resolve(workItemReviewEntities);
    const pendingWorkItemStatus: WorkItemStatus = await this.workItemStatusRepository.findOne(
      {
        where: {
          status: "pending",
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

    this.notifyForWorkItemCreation(
      createdWorkItem,
      await createdWorkItem.reviews,
    ); // The notification
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
        author: foundUser,
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

  public async editWorkItem(user: User, workItemId: string, editWorkItemDTO: EditWorkItemDTO): Promise<ShowWorkItemDTO> {
    const foundWorkItem: WorkItem = await this.workItemRepository.findOne({where: {
      id: workItemId,
    }});
    if(!foundWorkItem){
      return undefined;
    } 
    const role: Role = await user.role; // this may not work
    if(foundWorkItem.author.id !== user.id && role.name !== 'admin') {
      return undefined;
    } foundWorkItem.title = editWorkItemDTO.title;
    foundWorkItem.description = editWorkItemDTO.description;
    let updatedTagsList: Tag[] = [];
    for (const tagDTO of editWorkItemDTO.tags) {
      const foundTag: Tag = await this.tagsRepository.findOne({where: {
        name: tagDTO.name
      }});
      if(foundTag){
        updatedTagsList = [foundTag,...updatedTagsList];
      }

    }
    foundWorkItem.tags = Promise.resolve(updatedTagsList);
    const updatedWorkItem: WorkItem = await this.workItemRepository.save(foundWorkItem);
    this.notifyForEditedWorkItem(updatedWorkItem);
    const updatedWorkItemDTO: ShowWorkItemDTO = await this.convertToShowWorkItemDTO(updatedWorkItem);
    return updatedWorkItemDTO;
  }
  private notifyForWorkItemCreation(
    createdWorkItem: WorkItem,
    reviews: Review[],
  ): void {
    this.notifyReviewersForWorkItemCreation(reviews, createdWorkItem);
  }

  private notifyReviewersForWorkItemCreation(
    reviews: Review[],
    workItem: WorkItem,
  ): void {
    const author: User = workItem.author;
    const authorUsername: string = author.username;
    reviews.forEach((currentReview: Review) => {
      const text = `${authorUsername} has added you as a reviewer to ${
        workItem.title
      }. Press here to see: `;
      const link = `http://localhost:4200/pullRequests/${workItem.id}`;
      this.emailService.sendEmail(
        currentReview.user.email,
        "You are added as a reviewer",
        text + link,
      );
      this.pushNotificationService.sendPushNotfication(
        "You are added as a reviewer",
        text,
        currentReview.user.username,
        link,
      );
    });
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
            author: user,
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
        status: "pending",
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
  ): Promise<ShowReviewValDTO> {
    const review: Review = await this.reviewsRepository.findOne({
      where: {
        id: reviewer.id,
      },
    });
    const status = review.reviewerStatus;
    const convertedReviewer: ShowReviewValDTO = {
      userId: review.user.id,
      email: review.user.email,
      status: status.status,
      username: review.user.username,
      reviewId: review.id,
    };
    return convertedReviewer;
  }
  private async convertToShowReviewerDTOArray(
    reviewers: Review[],
  ): Promise<ShowReviewValDTO[]> {
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
    const showReviewDTO: ShowReviewValDTO[] = await this.convertToShowReviewerDTOArray(
      await workItem.reviews,
    );

    if (!showReviewDTO) {
      return new ShowWorkItemDTO();
    }
    if (!workItem.author) {
      return new ShowWorkItemDTO();
    }

    const assigneeDTO: ShowAssigneeDTO = {
      id: workItem.author.id,
      email: workItem.author.email,
      username: workItem.author.username,
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

    const workItemFiles: FileEntity[] = await this.fileRepository.find({
      where: {
        workItem: workItem,
      }
    })
    const filesURL: string[] = workItemFiles.map((fileEntity)=>fileEntity.url);
    const convertedWorkItem: ShowWorkItemDTO = {
      id: workItem.id,
      isReady: workItem.isReady,
      title: workItem.title,
      description: workItem.description,
      author: assigneeDTO,
      reviews: showReviewDTO,
      workItemStatus: workItem.workItemStatus,
      tags: tagDTOs,
      team: workItem.team,
      comments: commentDTOs,
      files: filesURL,
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

  public async getAllByQuery(query: WorkItemQueryDTO): Promise<any> {
    // if (
    //   query.team &&
    //   query.tag &&
    //   query.author &&
    //   query.asignee &&
    //   query.status &&
    //   query.title
    // ) {
    //   const currentStatus: WorkItemStatus = await this.workItemStatusRepository.findOne(
    //     {
    //       where: {
    //         status: query.status,
    //       },
    //     },
    //   );
    //   const asigneeQuery: User = await this.userRepository.findOne({
    //     where: {
    //       username: query.asignee,
    //     },
    //   });
    //   const authorQuery: User = await this.userRepository.findOne({
    //     where: {
    //       username: query.author,
    //     },
    //   });
    //   const queryObject = {};
    //   if (query.title) {
    //     queryObject.title = query.title;
    //   }
    //   if (query.author) {
    //     queryObject.author = query.author;
    //   }
    // const workitems: WorkItem[] = await this.workItemRepository.find({
    //   where: { queryObject },
    //   // title: query.title,
    //   // team: query.team,queryObject,
    //   // asignee: asigneeQuery,
    //   // workItemStatus: currentStatus,
    //   // author: authorQuery,
    // });
    // return await this.convertToShowWorkItemDTOs(workitems);
    // }
    // if (query.author) {
    //   const authorQuery: User = await this.userRepository.findOne({
    //     where: {
    //       username: query.author,
    //     },
    //   });
    //   const workitems: WorkItem[] = await this.workItemRepository.find({
    //     where: {
    //       author: authorQuery,
    //     },
    //   });
    //   return workitems;
    // }
    // if (query.author && query.team) {
    //   const authorQuery: User = await this.userRepository.findOne({
    //     where: {
    //       username: query.author,
    //     },
    //   });
    //   const teamQuery: Team = await this.teamsRepository.findOne({
    //     where: {
    //       teamName: query.team,
    //     },
    //   });
    //   const workitems: WorkItem[] = await this.workItemRepository.find({
    //     where: {
    //       author: authorQuery,
    //       team: teamQuery,
    //     },
    //   });
    //   return workitems;
    // }
    // if (query.asignee) {
    //   const asigneeQuery: User = await this.userRepository.findOne({
    //     where: {
    //       username: query.asignee,
    //     },
    //   });
    //   const reviews: Review[] = await this.reviewsRepository.find({
    //     where: {
    //       user: asigneeQuery,
    //     },
    //   });
    //   return reviews;
    // }
    // if (query.team) {
    //   const teamQuery: Team = await this.teamsRepository.findOne({
    //     where: {
    //       teamName: query.team,
    //     },
    //   });
    //   const workitems: WorkItem[] = await this.workItemRepository.find({
    //     where: {
    //       team: teamQuery,
    //     },
    //   });
    //   return workitems;
    // }
    // if (query.title) {
    //   const workitems: WorkItem[] = await this.workItemRepository.find({
    //     where: {
    //       title: query.title,
    //     },
    //   });
    //   return workitems;
    // }
    // if (query.status) {
    //   const statusQuery: WorkItemStatus = await this.workItemStatusRepository.findOne(
    //     {
    //       where: {
    //         status: query.status,
    //       },
    //     },
    //   );
    const allWorkItems: WorkItem[] = await this.workItemRepository.find({});
    let allWorkItemsToDTO: ShowWorkItemDTO[] = [];
    for (let item of allWorkItems) {
      const reviews = await item.reviews;
      const status = await item.workItemStatus;
      const statusToDTO = plainToClass(ShowWorkItemStatusDTO, status, {
        excludeExtraneousValues: true,
      });
      const reviewsToDTO = await this.convertToShowReviewerDTOArray(reviews);
      const tags = await this.convertTagstoDTOs(await item.tags);
      const team = await item.team;
      const teamToDTO = plainToClass(ShowTeamDTO, team, {
        excludeExtraneousValues: true,
      });
      const currentworkItem = item;
      const itemToDTO: ShowWorkItemDTO = plainToClass(
        ShowWorkItemDTO,
        currentworkItem,
        {
          excludeExtraneousValues: true,
        },
      );
      itemToDTO.reviews = reviewsToDTO;
      itemToDTO.tags = tags;
      itemToDTO.workItemStatus = statusToDTO;
      itemToDTO.team = teamToDTO;
      allWorkItemsToDTO.push(itemToDTO);
    }
    let result = allWorkItemsToDTO;
    if (query.title) {
      result = result.filter(x => x.title.indexOf(query.title) >= 0);
    }
    if (query.author) {
      result = result.filter(x => x.author.username === query.author);
    }
    if (query.asignee) {
      result = result.filter(
        x => x.reviews.findIndex(y => y.username === query.asignee) >= 0,
      );
    }
    if (query.tag) {
      result = result.filter(
        x => x.tags.findIndex(y => y.name === query.tag) >= 0,
      );
    }

    if (query.status) {
      result = result.filter(x => x.workItemStatus.status === query.status);
    }

    if (query.team) {
      result = result.filter(x => x.team.teamName === query.team);
    }

    return result;
  }
}
