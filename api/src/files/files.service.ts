import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WorkItem } from "../entities/work-item.entity";
import { Repository, getRepository } from "typeorm";
const fs = require("fs");


@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(WorkItem)
    private readonly workItemRepository: Repository<WorkItem>,
  ) {}
    public saveFiles(files, workItemId: string) {
      const filesEntities = Array.from(files);
      filesEntities.forEach((file)=>this.saveFile(file,workItemId));
      let fileNames: string[] = [];
      for (let i = 0; i < files.length; i++) {
        fileNames.push(files[i].originalname);
      }
      return fileNames;
    }

    private saveFile(file, workItemId: string): void {
    if (!fs.existsSync('./uploads')){
        fs.mkdirSync('./uploads');
    }
    const dir = `./uploads/${workItemId}`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    const path = `${dir}/${file.originalname}`;
    const writeStream = fs.createWriteStream(path);  
    writeStream.write(file.buffer);
    writeStream.end();   
  }
}
