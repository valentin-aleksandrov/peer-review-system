import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WorkItem } from "../entities/work-item.entity";
import { Repository, getRepository } from "typeorm";


@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(WorkItem)
    private readonly workItemRepository: Repository<WorkItem>,
  ) {}


}
