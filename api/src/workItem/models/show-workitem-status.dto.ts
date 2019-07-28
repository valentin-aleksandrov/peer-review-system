import { Expose } from "class-transformer";

export class ShowWorkItemStatusDTO {
  @Expose()
  status: string;
}
