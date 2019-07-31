import { IsString, Length, ValidateNested } from "class-validator";
import { AddTagDTO } from "./add-tag.dto";
import { Type } from "class-transformer";
import { ShowFileDTO } from "src/files/show-file.dto";

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

    @ValidateNested()
    @Type(() => ShowFileDTO) 
    filesToBeRemoved: ShowFileDTO[];
}