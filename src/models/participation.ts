import { PLAYER_ROLE_TYPE } from "../constants";

export class Participation {
  constructor(public userId: number, public roleType: PLAYER_ROLE_TYPE) {}
}
