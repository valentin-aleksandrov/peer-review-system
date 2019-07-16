import { Module } from '@nestjs/common';
import { ReviewRequestsService } from './review-requests.service';
import { ReviewRequestsController } from './review-requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from 'src/entities/comment.entity';
import { WorkItem } from 'src/entities/work-item.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity, WorkItem]),
    AuthModule,
  ],
  providers: [ReviewRequestsService],
  controllers: [ReviewRequestsController]
})
export class ReviewRequestsModule {}
