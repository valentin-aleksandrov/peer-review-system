import { WorkItemService } from "./work-item.service";
import { UseGuards, Controller, ValidationPipe, Post, Body, Req } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CreateWorkItemDTO } from "./models/create-work-item.dto";
import { ShowWorkItemDTO } from "./models/show-work-item.dto";

@UseGuards(AuthGuard())
@Controller('api/work-item')
export class WorkItemController {
  constructor(
    private readonly workItemService: WorkItemService,
  ) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ whitelist: true, transform: true })) createWorkItemDTO: CreateWorkItemDTO,
    @Req() request,
    ): Promise<ShowWorkItemDTO> {
      const newWorkItem = new ShowWorkItemDTO();
    return await Promise.resolve(newWorkItem);
  }



}