import {
  UseGuards,
  Controller,
  Post,
  Body,
  ValidationPipe,
  Req,
  Get,
  Param,
  BadRequestException,
  NotFoundException,
  Query,
  Put,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { WorkItemService } from "./work-item.service";
import { CreateWorkItemDTO } from "./models/create-work-item.dto";
import { ShowWorkItemDTO } from "./models/show-work-item.dto";
import { User } from "../entities/user.entity";
import { SessionUser } from "../decorators/session-user.decorator";
import { SearchWorkItemDTO } from "./models/search-work-item.dto";
import { ShowTagDTO } from "./models/show-tag.dto";
import { async } from "rxjs/internal/scheduler/async";
import { ChangeWorkItemStatus } from "./models/change-work-item-status.dto";
import { WorkItemQueryDTO } from "./models/workitem-query.dto";
import { EditWorkItemDTO } from "./models/edit-work-item.dto";

@UseGuards(AuthGuard())
@Controller("api/work-item")
export class WorkItemController {
  constructor(private readonly workItemService: WorkItemService) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ whitelist: false, transform: true }))
    createWorkItemDTO: CreateWorkItemDTO,
    @SessionUser() user: User,
  ): Promise<ShowWorkItemDTO> {
    return await this.workItemService.createWorkItem(user, createWorkItemDTO);
  }

  @Get("team/:teamId")
  async findWorkItemsByTeam(
    @Query() searchOptions: SearchWorkItemDTO,
    @Param("teamId") teamId: string,
  ): Promise<ShowWorkItemDTO[]> {
    const workItemsDTOs: ShowWorkItemDTO[] = await this.workItemService.findWorkItemsByTeam(
      teamId,
      searchOptions,
    );
    if (!workItemsDTOs) {
      throw new NotFoundException("No such team found.");
    } else {
      return workItemsDTOs;
    }
  }

  @Get("tags")
  async findAllTags(): Promise<ShowTagDTO[]> {
    return this.workItemService.findAllTags();
  }

  @Get(":id")
  async findWorkItemById(
    @Param("id") workItemId: string,
  ): Promise<ShowWorkItemDTO> {
    const foundWorkItem: ShowWorkItemDTO = await this.workItemService.findWorkItemById(
      workItemId,
    );
    if (!foundWorkItem) {
      throw new NotFoundException("No such work item found.");
    }

    return foundWorkItem;
  }
/*
  @Put(":itemId")
  async changeWorkItemStatus(
    @Param("itemId") workItemId: string,
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    newStatus: ChangeWorkItemStatus,
    @SessionUser() user: User,
  ): Promise<ShowWorkItemDTO> {
    const updatedWorkItem: ShowWorkItemDTO = await this.changeWorkItemStatus(
      workItemId,
      newStatus,
      user,
    );
    if (!updatedWorkItem) {
      throw new BadRequestException(
        "Invalid status or not enough accepted reviews.",
      );
    }
    return updatedWorkItem;
  }*/

  @Put(":itemId")
  async editWorkItem(
    @Param("itemId") workItemId: string,
    @Body(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))
    editedWorkItem: EditWorkItemDTO,
    @SessionUser() user: User,
  ): Promise<ShowWorkItemDTO> {
    const updatedWorkItem: ShowWorkItemDTO = await this.workItemService.editWorkItem(user,workItemId,editedWorkItem);
    if(!updatedWorkItem){
      throw new BadRequestException("Invalid workitem update");
    }
    return updatedWorkItem;
  }

  @Get()
  all(@Query() query: WorkItemQueryDTO): Promise<any> {
    return this.workItemService.getAllByQuery(query);
  }
}
