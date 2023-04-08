import { Database } from "./database.types";

export type Score = (number | null)[];

type DB_PUBLIC = Database["public"];
type DB_PUBLIC_TABLES = DB_PUBLIC["Tables"];

type TableRows = keyof DB_PUBLIC_TABLES;
type Enums = DB_PUBLIC["Enums"];
type PossibleEnums = keyof DB_PUBLIC["Enums"];

export type getTableRow<T extends TableRows> = DB_PUBLIC_TABLES[T]["Row"];
export type getEnum<T extends PossibleEnums> = Enums[T];

export type Player = getTableRow<"players">;

export type NewPlayer = Omit<Player, "id" | "created_at" | "profile_id">;

export type GameStatus = getEnum<"game_status">;
export type Game = Omit<getTableRow<"games">, "scores"> & {
  scores: Score[];
};

export type GameWithPlayers = Game & { players: Player[] };

export type NewGame = Omit<Game, "id" | "scores" | "created_at" | "status">;
