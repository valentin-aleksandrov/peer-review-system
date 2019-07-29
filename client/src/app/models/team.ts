import { TeamRules } from './team-rules';

export class Team {
  constructor(teamName){
    this.teamName = teamName;
  }
  id?: string;
  teamName: string;
  rules?: TeamRules;
  members?: {};
}
