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
import { WorkItemService } from "src/workItem/work-item.service";
import { FilesService } from "./files.service";


@UseGuards(AuthGuard())
@Controller("api/work-item")
export class FilesController {
  constructor(
    private readonly workItemService: WorkItemService,
    private readonly filesService: FilesService,
    ) {}

}
