import { UseGuards, Controller, Post, Body, ValidationPipe, Req, Get, Param } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { WorkItemService } from "./work-item.service";
import { CreateWorkItemDTO } from "./models/create-work-item.dto";
import { ShowWorkItemDTO } from "./models/show-work-item.dto";
import { User } from "../entities/user.entity";
import { SessionUser } from "../decorators/session-user.decorator";
import { ShowReviewerDTO } from "./models/show-reviewer.dto";

@UseGuards(AuthGuard())
@Controller('api/work-item')
export class WorkItemController {
  constructor(
    private readonly workItemService: WorkItemService,
  ) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ whitelist: false, transform: true })) createWorkItemDTO: CreateWorkItemDTO,
    @SessionUser() user: User
    ): Promise<ShowWorkItemDTO> {
     return await this.workItemService.createWorkItem(user,createWorkItemDTO);
  }
  
    @Get("team/:teamId")
    async findWorkItemsByTeam(@Param('teamId') teamId: string,): Promise<ShowWorkItemDTO[]> {

      console.log(teamId);
      
        const workItemsDTOs: ShowWorkItemDTO[] = await this.workItemService.findWorkItemsByTeam(teamId);
        if(!workItemsDTOs){
          console.log("You need a http exception!!!");
        } else {
          return workItemsDTOs;
        }
    }
}