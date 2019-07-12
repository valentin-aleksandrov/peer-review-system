import { CoreModule } from '../core/core.module';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { ReviewerStatus } from '../entities/reviewer-status.entity';
import { Role } from '../entities/role.entity';
import { WorkItemModule } from '../workItem/work-item.module';
import { WorkItem } from '../entities/work-item.entity';
import { WorkItemStatus } from '../entities/work-item-status.entity';
import { Tag } from '../entities/tag.entity';
import { Review } from '../entities/review.entity';
import { Picture } from '../entities/picture.entity';
import { FileEntity } from '../entities/file.entity';
import { WorkItemService } from '../workItem/work-item.service';

@Module({
  imports: [
    CoreModule,
    PassportModule.register({defaultStrategy: 'jwt'}),
    TypeOrmModule.forFeature([
      User,
      ReviewerStatus, 
      Role,
      WorkItem, 
      WorkItemStatus, 
      Tag, 
      Review, 
      Picture, 
      FileEntity
  ]),
    WorkItemModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, WorkItemService],
  exports: [UsersService],
})
export class UsersModule {}
