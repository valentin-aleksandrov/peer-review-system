import { IsString } from "class-validator";

export class ShowFileDTO {
    @IsString()
    fileName: string;

    @IsString()
    url: string;
}