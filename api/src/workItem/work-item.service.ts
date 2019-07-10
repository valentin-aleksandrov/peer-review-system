import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WorkItem } from "src/entities/work-item.entity";
import { Repository } from "typeorm";

@Injectable()
export class WorkItemService {
  constructor(
    @InjectRepository(WorkItem)
    private readonly usersRepository: Repository<WorkItem>
  ) {}

}