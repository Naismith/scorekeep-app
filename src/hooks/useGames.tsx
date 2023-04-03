import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NewGame, Game } from "../models";
import { v4 as uuid } from "uuid";

let games: Game[] = [
  {
    reversedScoring: true,
    showInterimResults: true,
    showGameResults: true,
    id: "abc",
    title: "Example",
    scores: [],
    players: [],

    updatedAt: new Date(),
    createdAt: new Date(),
  },
];

const getGames = () => Promise.resolve(games);

export const useGamesQuery = () => {
  return useQuery({
    queryKey: ["useGamesQuery"],
    queryFn: getGames,
  });
};

export const useCreateGameMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (partialGame: NewGame) => {
      const now = new Date();
      const newGame: Game = {
        ...partialGame,
        id: uuid(),
        scores: [],
        createdAt: now,
        updatedAt: now,
      };
      games.push(newGame);

      queryClient.invalidateQueries({
        queryKey: ["useGamesQuery"],
      });

      return Promise.resolve(newGame);
    },
  });
};
