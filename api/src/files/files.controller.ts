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
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { WorkItemService } from "src/workItem/work-item.service";
import { FilesService } from "./files.service";
import { FilesInterceptor } from "@nestjs/platform-express";


@UseGuards(AuthGuard())
@Controller("api/files")
export class FilesController {
  constructor(
    private readonly workItemService: WorkItemService,
    private readonly filesService: FilesService,
    ) {}

  @Post('workItem/:id')
  @UseInterceptors(FilesInterceptor('files'))
  uploadFile(
    @UploadedFiles() files,
    @Param("id") workItemId: string,
    ) {
    console.log('files',files);
    console.log('workItemId',workItemId);
    
  }
}
