import { IsString, Length, Max, Min, IsInt } from "class-validator";

export class TeamRuleDTO {

    @IsInt()
    @Min(50)
    @Max(100)
    minPercentApprovalOfItem: number;

    @IsInt()
    @Min(2)
    minNumberOfReviewers: number;

}