import { IParticipationAttributes } from "../interfaces/iparticipation_attributes";
import { BaseModelStore } from "../storage/base_model_store";

export class ParticipationStore extends BaseModelStore<IParticipationAttributes> {
  constructor(tableName: string = "game_session_participations") {
    super(tableName);
  }
}
