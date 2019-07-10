import { WorkItemController } from "./work-item.controller";
import { WorkItem } from "src/entities/work-item.entity";
import { Role } from "src/entities/role.entity";
import { ReviewerStatus } from "src/entities/reviewer-status.entity";
import { User } from "src/entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { CoreModule } from "src/core/core.module";
import { UsersService } from "src/users/users.service";
import { WorkItemService } from "./work-item.service";
import { Module } from "@nestjs/common";

@Module({
    imports: [
      PassportModule.register({defaultStrategy: 'jwt'}),
      TypeOrmModule.forFeature([User,ReviewerStatus, Role, WorkItem]),
    ],
    controllers: [WorkItemController],
    providers: [
        UsersService,
        WorkItemService,
        CoreModule,
    ],
    exports: [
      WorkItemService
    ],
  })
  export class WorkItemModule {}