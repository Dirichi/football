import { PLAYER_ROLE_TYPE } from "../constants";
import { IParticipationAttributes } from "../interfaces/iparticipation_attributes";
import { StorageService } from "../storage/storage_service";

export class Participation {
  public static find(id: number): Promise<Participation> {
    return this.store().find(id);
  }

  public static findOrCreateBy(
    attributes: Partial<IParticipationAttributes>): Promise<Participation> {
    return this.store().findOrCreateBy(attributes);
  }

  public static findBy(
    attributes: Partial<IParticipationAttributes>): Promise<Participation> {
    return this.store().findBy(attributes);
  }

  public static create(
    attributes: Partial<IParticipationAttributes>): Promise<Participation> {
    return this.store().create(attributes);
  }

  private static store(): StorageService<IParticipationAttributes, Participation> {
    return new StorageService(Participation, { tableName: "game_session_participations" });
  }

  get userId(): number {
    return this.attributes.userId;
  }

  get roleType(): PLAYER_ROLE_TYPE {
    return this.attributes.roleType;
  }
  constructor(private attributes: IParticipationAttributes) { }
}
