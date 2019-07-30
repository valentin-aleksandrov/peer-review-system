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
  Res,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { WorkItemService } from "src/workItem/work-item.service";
import { FilesService } from "./files.service";
import { FilesInterceptor } from "@nestjs/platform-express";

@Controller("api/files")
export class FilesController {
  constructor(
    private readonly workItemService: WorkItemService,
    private readonly filesService: FilesService,
    ) {}

  @Post('workItem/:id')
  @UseGuards(AuthGuard())
  @UseInterceptors(FilesInterceptor('files'))
  uploadFile(
    @UploadedFiles() files,
    @Param("id") workItemId: string,
    ) {
    const fileNames: string[] = this.filesService.saveFiles(files, workItemId);
    return 'ok';
  }

  @Get(":url")
  async getFile(@Res() response, @Param("url") fileURL: string,){
    return response.download(`uploads/${fileURL}`)
  }



 
}
