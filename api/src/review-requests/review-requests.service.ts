import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CommentEntity } from "src/entities/comment.entity";
import { AddCommentDTO } from "./models/add-comment.dto";
import { async } from "rxjs/internal/scheduler/async";
import { ShowCommentDTO } from "./models/show-comment.dto";
import { WorkItem } from "src/entities/work-item.entity";
import { plainToClass } from "class-transformer";
import { User } from "src/entities/user.entity";
import { ReviewerStatus } from "src/entities/reviewer-status.entity";
import { ChangeReviewStatusDTO } from "./models/change-review-status.dto";
import { Review } from "src/entities/review.entity";
import { ShowReviewDTO } from "./models/show-review.dto";
import { CombinedReviewDTO } from "./models/combined-review.dto";
import { EmailService } from "src/notifications/email.service";
import { PushNotificationService } from "src/notifications/push-notification.service";
import { ShowUserDTO } from "src/users/models/show-user.dto";

@Injectable()
export class ReviewRequestsService {
  public constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    @InjectRepository(WorkItem)
    private workItemRepository: Repository<WorkItem>,
    @InjectRepository(ReviewerStatus)
    private reviewStatusRepository: Repository<ReviewerStatus>,
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    private readonly emailService: EmailService,
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  public async createReviewRequestComment(
    workItemId: string,
    commentContent: AddCommentDTO,
    user: User,
  ): Promise<ShowCommentDTO> {
    const commentEntity: CommentEntity = new CommentEntity();
    commentEntity.content = commentContent.content;
    commentEntity.author = user;
    const commentWorkItem = await this.workItemRepository.findOne({
      where: { id: workItemId },
    });
    commentEntity.workItem = Promise.resolve(commentWorkItem);
    const newComment: CommentEntity = await this.commentRepository.save(
      commentEntity,
    );
    const commentToShow = plainToClass(ShowCommentDTO, newComment, {
      excludeExtraneousValues: true,
    });
    await this.notifyForWorkItemComment(commentToShow,commentWorkItem);
    return await commentToShow;
  }

  public async changeReviewStatus(
    workItemId: string,
    reviewId: string,
    status: ChangeReviewStatusDTO,
    user: User,
  ): Promise<CombinedReviewDTO> {
    const newStatus: ReviewerStatus = await this.reviewStatusRepository.findOne(
      { where: { status: status.status } },
    );

    const review: Review = await this.reviewRepository.findOne({
      where: { id: reviewId },
    });

    const commentContent: AddCommentDTO = {
      content: status.content,
    };
    let commentDTO: ShowCommentDTO = null;
    
    
    if (newStatus.status !== "pending") {
      commentDTO = await this.createReviewRequestComment(
        workItemId,
        commentContent,
        user,
      );
    }
    
    review.reviewerStatus = newStatus;
    const newReview = await this.reviewRepository.save(review);

    // plain to class returns ShowReview without a reviewStatus and a user D: (linux issue)
    // const reviewToShow: ShowReviewDTO = plainToClass(ShowReviewDTO, newReview, {
    //   excludeExtraneousValues: true,
    // });
    const reviewToShow: ShowReviewDTO = {
      id: newReview.id,
      reviewStatus: newReview.reviewerStatus,
      user: await this.convertToShowUserDTO(newReview.user),
    };

    
    const combined: CombinedReviewDTO = {
      review: reviewToShow,
      comment: commentDTO,
    };
    const workItem: WorkItem = await this.workItemRepository.findOne({ where: {
      id: workItemId,
    }})
    this.notifyForReviewStatusChange(workItem,combined);
    return await combined;
  }
  private async notifyForReviewStatusChange(workItem: WorkItem, combined: CombinedReviewDTO): Promise<void> {  
    const reviews: Review[] = await workItem.reviews;
    // I need this step, because linux doesn't load reviews with all of data (only IDs D:)
    let loadedReviews: Review[] = [];
    for (const currentReview of reviews) {
      const currentlyLoadedReview: Review = await this.reviewRepository.findOne({
        where: {
          id: currentReview.id,
        }
      });
      loadedReviews = [currentlyLoadedReview,...loadedReviews];
    }
    this.notifyUserForReviewStatusChange(workItem.author,workItem, combined);  

    loadedReviews
      .map((review: Review)=>review.user)
      .filter((user: User)=>user.id !== combined.review.user.id)
      .forEach((user: User)=>this.notifyUserForReviewStatusChange(user,workItem, combined));
  }
  private notifyUserForReviewStatusChange(user: User, workItem: WorkItem, combined: CombinedReviewDTO): void {
    const link: string = `http://localhost:4200/pullRequests/${workItem.id}`;
    
    this.emailService.sendEmail(
      user.email,
      'Review status change',
      `${combined.comment.author.username} change his review status to ${combined.review.reviewStatus.status} for Work Item ${workItem.title} because ${combined.comment.content}. Press here: ${link}`
    );

    this.pushNotificationService.sendPushNotfication(
      'Review status change',
      `${combined.comment.author.username} change his review status to ${combined.review.reviewStatus.status} for Work Item ${workItem.title}. Press here:`,
      user.username,
      link
    );
  }

  private async notifyForWorkItemComment(comment: ShowCommentDTO, workItem: WorkItem): Promise<void> {
    const workItemAuthor: User = workItem.author;
    const reviews: Review[] = await workItem.reviews;
    // I need this step, because linux doesn't load reviews with all of data (only IDs D:)
    let loadedReviews: Review[] = [];
    for (const currentReview of reviews) {
      const currentlyLoadedReview: Review = await this.reviewRepository.findOne({
        where: {
          id: currentReview.id,
        }
      });
      loadedReviews = [currentlyLoadedReview,...loadedReviews];
    }
    
    const reviewersEntities: User[] = loadedReviews.map((review: Review)=>review.user);
    if(comment.author.username !== workItemAuthor.username){
      this.notifyUserForComment(workItem.author, workItem, comment);
    }
    
    reviewersEntities
      .filter((user: User)=>user.id !== comment.author.id)
      .forEach((user: User)=>this.notifyUserForComment(user,workItem, comment));
  }
  private notifyUserForComment(user: User, workItem: WorkItem, comment: ShowCommentDTO): void {
    const link: string = `http://localhost:4200/pullRequests/${workItem.id}`;

    this.emailService.sendEmail(
      user.email,
      'New comment',
      `${comment.author.username} comment on Work Item ${workItem.title}. Press here: ${link}`
    );

    this.pushNotificationService.sendPushNotfication(
      'New comment',
      `${comment.author.username} comment on Work Item ${workItem.title}. Press here:`,
      user.username,
      link
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
