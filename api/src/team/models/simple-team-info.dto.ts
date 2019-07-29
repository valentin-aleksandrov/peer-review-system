import { TeamRuleDTO } from "./team-rule.dto";

export class SimpleTeamInfoDTO{
    id: string;
    teamName: string;
    members: string[];
    rules: TeamRuleDTO;
}