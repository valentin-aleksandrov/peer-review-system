import { WorkItem } from "src/entities/work-item.entity";
import { Role } from "src/entities/role.entity";
import { ReviewerStatus } from "src/entities/reviewer-status.entity";
import { User } from "src/entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { CoreModule } from "src/core/core.module";
import { UsersService } from "src/users/users.service";

import { Module } from "@nestjs/common";
import { WorkItemStatus } from "../entities/work-item-status.entity";
import { Tag } from "../entities/tag.entity";
import { Review } from "../entities/review.entity";
import { Picture } from "../entities/picture.entity";
import { FileEntity } from "../entities/file.entity";
import { Team } from "src/entities/team.entity";
import { CommentEntity } from "../entities/comment.entity";
import { NotificatorModule } from "src/notifications/notifaction.module";
import { FilesService } from "./files.service";
import { FilesController } from "./files.controller";
import { WorkItemModule } from "src/workItem/work-item.module";
@Module({
    imports: [
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
        FileEntity,
        Team,
        CommentEntity,
      ]),
      NotificatorModule,
      WorkItemModule,
    ],
    controllers: [FilesController],
    providers: [
        UsersService,
        FilesService,
        CoreModule,
    ],
    exports: [
      FilesService
    ],
  })
  export class FilesModule {}