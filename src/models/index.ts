export type Score = (number | null)[];

export type Player = {
  id: string;
  name: string;
  color: string;
};

export type NewPlayer = Omit<Player, "id">;

export type Game = {
  id: string;
  title: string;
  maxScore?: number;
  countOfGameRounds?: number;
  reversedScoring: boolean;
  showInterimResults: boolean;
  showGameResults: boolean;
  players: Player[];
  scores: Score[];
  createdAt: Date;
  updatedAt: Date;
};

export type NewGame = Omit<Game, "id" | "scores" | "createdAt" | "updatedAt">;
