import { UseGuards, Controller, Post, Body, ValidationPipe, Req, Get } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { WorkItemService } from "./work-item.service";
import { CreateWorkItemDTO } from "./models/create-work-item.dto";
import { ShowWorkItemDTO } from "./models/show-work-item.dto";
import { User } from "../entities/user.entity";
import { SessionUser } from "../decorators/session-user.decorator";

@UseGuards(AuthGuard())
@Controller('test')
export class WorkItemController {
  constructor(
    private readonly workItemService: WorkItemService,
  ) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ whitelist: true, transform: true })) createWorkItemDTO: CreateWorkItemDTO,
    @SessionUser() user: User
    ): Promise<ShowWorkItemDTO> {
      console.log("Create work item works :D");
      
      console.log(createWorkItemDTO);

      console.log(user);
      
      
      const newWorkItem = new ShowWorkItemDTO();
    return await Promise.resolve(newWorkItem);
  }
  
  @Get()
    findAll(): string {
        return "findAll is not ready.";
    }


}