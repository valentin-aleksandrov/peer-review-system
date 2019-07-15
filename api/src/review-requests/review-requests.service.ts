import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from 'src/entities/comment.entity';
import { AddCommentDTO } from './models/add-comment.dto';
import { async } from 'rxjs/internal/scheduler/async';
import { ShowCommentDTO } from './models/show-comment.dto';
import { WorkItem } from 'src/entities/work-item.entity';
import { plainToClass } from 'class-transformer';
import { User } from 'src/entities/user.entity';
import { ReviewerStatus } from 'src/entities/reviewer-status.entity';
import { ChangeReviewStatusDTO } from './models/change-review-status.dto';
import { Review } from 'src/entities/review.entity';

@Injectable()
export class ReviewRequestsService {
    public constructor(
    @InjectRepository(CommentEntity) private commentRepository: Repository<CommentEntity>,
    @InjectRepository(WorkItem) private workItemRepository: Repository<WorkItem>,
    @InjectRepository(ReviewerStatus) private reviewStatusRepository: Repository<ReviewerStatus>,
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
  ) { }

public async createReviewRequestComment(workItemId: string, commentContent: AddCommentDTO, user: User): Promise<ShowCommentDTO> {
    const commentEntity: CommentEntity = new CommentEntity();
    commentEntity.content = commentContent.content;
    commentEntity.author = user;
    console.log(user);
    console.log(commentEntity.author);
    const commentWorkItem = await this.workItemRepository.findOne ({ where: { id: workItemId } });
    commentEntity.workItem = Promise.resolve(commentWorkItem);
    const newComment: CommentEntity = await this.commentRepository.save(commentEntity);
    const commentToShow = plainToClass(ShowCommentDTO, newComment, { excludeExtraneousValues: true });
    return await commentToShow;
}

public async changeReviewStatus(workItemId: string, reviewId: string, status: ChangeReviewStatusDTO, user: User): Promise<any> {
    const newStatus: ReviewerStatus = await this.reviewStatusRepository.findOne({ where: { status: status.status } });
    console.log(user)
    const review: Review = await this.reviewRepository.findOne({ where: { id: reviewId } });
    const commentContent: AddCommentDTO = {
        content: status.content,
    }
    if (newStatus.status !== 'pending') {
        const commentEntity: ShowCommentDTO = await  this.createReviewRequestComment(workItemId, commentContent, user);
        
    }
    review.reviewerStatus = newStatus;
    const newReview = this.reviewRepository.save(review);
    return await newReview;
}
}