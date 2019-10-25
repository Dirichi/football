import { Team } from "../game_objects/team";

export interface ITeamInControlCalculator {
  getTeamInControl(): Team | null;
}
