import { Database } from "./database.types";

export type Score = (number | null)[];

type TableRows = keyof Database["public"]["Tables"];
export type getTableRow<T extends TableRows> =
  Database["public"]["Tables"][T]["Row"];

export type Player = getTableRow<"players">;

export type NewPlayer = Omit<Player, "id" | "created_at" | "profile_id">;

export type GameStatus = "in-progress" | "finished";
export type Game = {
  id: string;
  title: string;
  maxScore?: number;
  countOfGameRounds?: number;
  reversedScoring: boolean;
  showInterimResults: boolean;
  showGameRounds: boolean;
  players: Player[];
  scores: Score[];
  createdAt: Date;
  updatedAt: Date;
  status: GameStatus;
};

export type NewGame = Omit<
  Game,
  "id" | "scores" | "createdAt" | "updatedAt" | "status"
>;
