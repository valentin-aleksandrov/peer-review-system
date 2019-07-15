import { Controller, Post, ValidationPipe, Body, Param, UseGuards, Put } from '@nestjs/common';
import { ReviewRequestsService } from './review-requests.service';
import { AddCommentDTO } from './models/add-comment.dto';
import { User } from 'src/entities/user.entity';
import { ShowCommentDTO } from './models/show-comment.dto';
import { AuthGuard } from '@nestjs/passport';
import { SessionUser } from 'src/decorators/session-user.decorator';
import { ChangeReviewStatusDTO } from './models/change-review-status.dto';

@Controller('api/work-item/:id/review-requests')
export class ReviewRequestsController {

    constructor(
        private readonly reviewRequestService: ReviewRequestsService,
      ) {}

      @Post(':reviewId/comments')
      @UseGuards(AuthGuard())
      public async createC(
      @Param('id') id: string,
      @Param('reviewId') reviewId: string,
      @Body(new ValidationPipe({ whitelist: true, transform: true }))
      body: AddCommentDTO,
      @SessionUser() user: User,
    ): Promise<ShowCommentDTO> {
      return await this.reviewRequestService.createReviewRequestComment(id, body, user);
    }

    @Put(':reviewId/')
    @UseGuards(AuthGuard())
    public async changeStatus(
    @Param('id') id: string,
    @Param('reviewId') reviewId: string,
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    newStatus: ChangeReviewStatusDTO,
    @SessionUser() user: User,
  ): Promise<ShowCommentDTO> {
    return await this.reviewRequestService.changeReviewStatus(id, reviewId, newStatus, user);
  }

}
