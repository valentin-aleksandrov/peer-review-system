import { Module } from '@nestjs/common';
import { ReviewRequestsService } from './review-requests.service';
import { ReviewRequestsController } from './review-requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from 'src/entities/comment.entity';
import { WorkItem } from '../entities/work-item.entity';
import { AuthModule } from '../auth/auth.module';
import { ReviewerStatus } from '../entities/reviewer-status.entity';
import { Review } from '../entities/review.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    TypeOrmModule.forFeature([CommentEntity, WorkItem, ReviewerStatus,Review]),
    AuthModule,
  ],
  providers: [ReviewRequestsService],
  controllers: [ReviewRequestsController]
})
export class ReviewRequestsModule {}
