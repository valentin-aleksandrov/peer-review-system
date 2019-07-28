import { Expose } from "class-transformer";

export class ShowAssigneeDTO {
  @Expose()
  id: string;
  @Expose()
  email: string;
  @Expose()
  username: string;
}
