import { IsString, Length, ValidateNested } from "class-validator";
import { AddTagDTO } from "./add-tag.dto";
import { Type } from "class-transformer";

export class EditWorkItemDTO {
    @IsString()
    @Length(1, 60)
    title: string;
  
    @IsString()
    @Length(1, 100000)
    description: string;

    @ValidateNested()
    @Type(() => AddTagDTO) 
    tags: AddTagDTO[];
}