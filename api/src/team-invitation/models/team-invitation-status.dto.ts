import { Expose } from "class-transformer";

export class ShowTeamInvitationStatusDTO {

  @Expose()
  id: string;

  @Expose()
  status: string;

}