import { PluckReturnTypes } from "../../../custom_types/types";
import { Player } from "../../../game_objects/player";
import { IPlayerStateFeatureExtractor } from "../../../interfaces/iplayer_state_feature_extractor";
import { ITickService } from "../../../interfaces/itick_service";
import { hasKey } from "../../../utils/helper_functions";

type FeatureRecord = PluckReturnTypes<IPlayerStateFeatureExtractor>;

export class FeatureExtractorCacher {
  constructor(
    private internalExtractor: IPlayerStateFeatureExtractor,
    private tickService: ITickService,
    private refreshTime: number,
    private cache: Map<Player, FeatureRecord> = new Map([])) {
  }

  public createCachingProxy(): IPlayerStateFeatureExtractor {
    return new Proxy(this.internalExtractor, {
      get: (target, propertyKey) => {
        if (!hasKey(target, propertyKey)) { return null; }
        return (player: Player) => {
          const record = this.getCachedPlayerRecord(player);
          let result = record[propertyKey];
          if (result === undefined) {
            result = target[propertyKey](player);
            this.updateCachedPlayerRecord(player, propertyKey, result);
          }
          return result;
        };
      }
    });
  }

  public enableRefreshing(): void {
    this.tickService.every(this.refreshTime, () => this.cache.clear());
  }

  private getCachedPlayerRecord(player: Player): FeatureRecord {
    if (this.cache.get(player) === undefined) {
      this.cache.set(player, {} as FeatureRecord);
    }
    return this.cache.get(player);
  }

  private updateCachedPlayerRecord
    <K extends keyof FeatureRecord, V extends FeatureRecord[K]>(
      player: Player, propertyKey: K, value: V): void {
    const record = this.cache.get(player);
    record[propertyKey] = value;
  }
}
