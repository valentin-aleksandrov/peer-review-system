import { IsString } from "class-validator";
import { Expose } from "class-transformer";
export class ChangeWorkItemStatus {
  @Expose()
  @IsString()
  status: string;
}
