import { IsString, Length } from "class-validator";

export class AddTagDTO {
    @IsString()
    @Length(1, 60)
    name: string;
}