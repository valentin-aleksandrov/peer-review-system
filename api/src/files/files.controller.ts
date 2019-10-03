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
import { ShowWorkItemDTO } from "src/workItem/models/show-work-item.dto";
import { async } from "rxjs/internal/scheduler/async";

@Controller("api/files")
export class FilesController {
  constructor(
    private readonly workItemService: WorkItemService,
    private readonly filesService: FilesService,
    ) {}

  @Post('workItem/:id')
  @UseGuards(AuthGuard())
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(
    @UploadedFiles() files,
    @Param("id") workItemId: string,
    ): Promise<ShowWorkItemDTO> {
    const fileNames: string[] = this.filesService.saveFiles(files, workItemId);
    // save to work Item
    const updatedWorkItem: ShowWorkItemDTO = await this.workItemService.attachedFilesToWorkItem(fileNames,workItemId);
    
    if(!updatedWorkItem){
      throw new NotFoundException(`Work Item with ${workItemId} id not found.`);
    }

    return updatedWorkItem;
  }

  @Get("uploads/:item/:fileName")
  async getFile(@Res() response, 
  @Param("item") workItemId: string,
  @Param("fileName") fileName: string,
  ){
    return response.download(`uploads/${workItemId}/${fileName}`)
  }



 
}
