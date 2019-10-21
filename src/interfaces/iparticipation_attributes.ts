export interface IParticipationAttributes {
  id?: number;
  userId?: number;
  gameSessionId?: number;
  role: number;
  teamId: number;
  roleType: number;
  completedPasses?: number;
  totalPasses?: number;
  totalShots?: number;
  totalGoals?: number;
  createdAt?: number;
  updatedAt?: number;
}
