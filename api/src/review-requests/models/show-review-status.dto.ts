import { Expose } from "class-transformer";
import { IsString } from "class-validator";

export class ShowReviewStatusDTO {

    @Expose()
    @IsString()
    status: string;
}