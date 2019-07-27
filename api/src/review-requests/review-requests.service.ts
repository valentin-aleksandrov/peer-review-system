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
    await this.notifyForWorkItemComment(commentToShow, commentWorkItem);
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
    console.log("revId", reviewId);
    const review: Review = await this.reviewRepository.findOne({
      where: { id: reviewId },
    });
    console.log("review", review);
    const commentContent: AddCommentDTO = {
      content: status.content,
    };
    let commentEntity: ShowCommentDTO = null;
    if (newStatus.status !== "pending") {
      commentEntity = await this.createReviewRequestComment(
        workItemId,
        commentContent,
        user,
      );
    }
    review.reviewerStatus = newStatus;
    const newReview = await this.reviewRepository.save(review);
    const reviewToShow: ShowReviewDTO = plainToClass(ShowReviewDTO, newReview, {
      excludeExtraneousValues: true,
    });
    const combined: CombinedReviewDTO = {
      review: reviewToShow,
      comment: commentEntity,
    };
    return await combined;
  }
  private async notifyForWorkItemComment(
    comment: ShowCommentDTO,
    workItem: WorkItem,
  ): Promise<void> {
    const workItemAuthor: User = workItem.author;
    const reviews: Review[] = await workItem.reviews;
    // I need this step, because linux doesn't load reviews with all of data (only IDs D:)
    let loadedReviews: Review[] = [];
    for (const currentReview of reviews) {
      const currentlyLoadedReview: Review = await this.reviewRepository.findOne(
        {
          where: {
            id: currentReview.id,
          },
        },
      );
      loadedReviews = [currentlyLoadedReview, ...loadedReviews];
    }

    const reviewersEntities: User[] = loadedReviews.map(
      (review: Review) => review.user,
    );
    if (comment.author.username !== workItemAuthor.username) {
      this.notifyUserForComment(workItem.author, workItem, comment);
    }

    reviewersEntities
      .filter((user: User) => user.id !== comment.author.id)
      .forEach((user: User) =>
        this.notifyUserForComment(user, workItem, comment),
      );
  }
  private notifyUserForComment(
    user: User,
    workItem: WorkItem,
    comment: ShowCommentDTO,
  ): void {
    const link: string = `http://localhost:4200/pullRequests/${workItem.id}`;

    this.emailService.sendEmail(
      user.email,
      "New comment",
      `${comment.author.username} comment on Work Item ${
        workItem.title
      }. Press here: ${link}`,
    );

    this.pushNotificationService.sendPushNotfication(
      "New comment",
      `${comment.author.username} comment on Work Item ${
        workItem.title
      }. Press here:`,
      user.username,
      link,
    );
  }
}
