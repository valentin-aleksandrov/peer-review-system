import { UseGuards, Controller, Post, Body, ValidationPipe, Req, Get } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { WorkItemService } from "./work-item.service";
import { CreateWorkItemDTO } from "./models/create-work-item.dto";
import { ShowWorkItemDTO } from "./models/show-work-item.dto";

@UseGuards(AuthGuard())
@Controller('test')
export class WorkItemController {
  constructor(
    private readonly workItemService: WorkItemService,
  ) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ whitelist: true, transform: true })) createWorkItemDTO: CreateWorkItemDTO,
    @Req() request,
    ): Promise<ShowWorkItemDTO> {
      console.log("Create work item works :D");
      
      console.log(createWorkItemDTO);

      console.log(request);
      
      
      const newWorkItem = new ShowWorkItemDTO();
    return await Promise.resolve(newWorkItem);
  }
  
  @Get()
    findAll(): string {
        return "findAll is not ready.";
    }


}