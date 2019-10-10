import { IParticipationAttributes } from "./iparticipation_attributes";

export interface IGameSessionAttributes {
  id: number;
  gameRoomId: string;
  startedAt: number;
  endedAt: number;
  createdAt: number;
  updatedAt: number;
  participations: IParticipationAttributes[];
}
