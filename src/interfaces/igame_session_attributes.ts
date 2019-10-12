import { IParticipationAttributes } from "./iparticipation_attributes";

export interface IGameSessionAttributes {
  id?: number;
  gameRoomId: string;
  startedAt?: Date;
  endedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  participations?: IParticipationAttributes[];
}
