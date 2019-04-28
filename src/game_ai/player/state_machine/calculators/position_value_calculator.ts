// import { Ball } from "../../../game_objects/ball";
// import { Player } from "../../../game_objects/player";
//
// export class PositionValueCalculator {
//   private ball: Ball;
//   private passValueCalculator: PassValueCalculator;
//   private shotValueCalculator: ShotValueCalculator;
//
//   constructor(
//     ball: Ball,
//     passValueCalculator: PassValueCalculator,
//     shotValueCalculator: ShotValueCalculator) {
//       this.ball = ball;
//       this.passValueCalculator = passValueCalculator;
//       this.shotValueCalculator = shotValueCalculator;
//   }
//
//   public valueFor(player: Player): number {
//     let score = 0;
//     score += this.shotValueCalculator.valueFor(player) * 0.5;
//     score += this.passValueCalculator.valueFor(player) * 0.5;
//     return score;
//   }
// }
