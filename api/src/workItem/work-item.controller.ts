import { WorkItemService } from "./work-item.service";
import { UseGuards, Controller } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@UseGuards(AuthGuard())
@Controller('api/users')
export class WorkItemController {
  constructor(
    private readonly workItemService: WorkItemService,
  ) {}

    // @Get()
    // async findAll(): Promise<ShowUserDTO[]> {
    //     return this.userService.findAllUsers();
    // }
}