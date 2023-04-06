import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { NewGame, Game, Score } from "../models";
import { v4 as uuid } from "uuid";
import { useState } from "react";

const createGame = (): Game => ({
  reversedScoring: true,
  showInterimResults: true,
  showGameRounds: true,
  id: "abc",
  title: "Example",
  status: "in-progress",
  scores: [[null, null, null, null]],
  players: [
    {
      name: "Rebecca",
      color: "#d3d3d3",
      id: "123",
    },
    {
      name: "Chris",
      color: "#7cfc00",
      id: "456",
    },
    {
      name: "Chris",
      color: "#7cfc00",
      id: "789",
    },
    {
      name: "Chris",
      color: "#7cfc00",
      id: "1011",
    },
  ],

  updatedAt: new Date(),
  createdAt: new Date(),
});
let games: Game[] = [createGame(), createGame(), createGame()];

const getGames = () => Promise.resolve(games);

export const useGamesQuery = (options?: UseQueryOptions<Game[]>) => {
  return useQuery({
    queryKey: ["useGamesQuery"],
    queryFn: getGames,
    ...options,
  });
};

export const useGameTotalsQuery = (id: string) => {
  const game = games.find((game) => game.id === id);

  if (!game) return [];

  return game.scores
    .reduce((acc: number[], row) => {
      row.forEach((score, index) => {
        acc[index] = (acc[index] || 0) + (score || 0);
      });
      return acc;
    }, [] as number[])
    .map((score, i) => {
      return [score, game.players[i]] as const;
    })
    .sort(([a], [b]) => {
      return game.reversedScoring ? a - b : b - a;
    });
};

export const useFinishGameMutation = (id: string) => {
  const game = games.find((game) => game.id === id);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (game) {
        game.status = "finished";
        queryClient.invalidateQueries({ queryKey: ["useGameById", id] });
      }

      return Promise.resolve(game);
    },
  });
};

export const useGameByIdQuery = (id: string, options?: UseQueryOptions) => {
  const game = games.find((game) => game.id === id);

  return useQuery({
    queryKey: ["useGameById", id],
    queryFn: () => Promise.resolve(game),
  });
};

export const useUpdateRowMutation = (id: string) => {
  const queryClient = useQueryClient();
  const gameIndex = games.findIndex((game) => game.id === id);

  return useMutation({
    mutationFn: ({ rowIndex, row }: { rowIndex: number; row: Score }) => {
      if (gameIndex >= 0) {
        games[gameIndex].scores[rowIndex] = row;
      }

      queryClient.invalidateQueries({ queryKey: ["useGameById", id] });

      return Promise.resolve();
    },
  });
};

export const useCreateNewRowMutation = (
  id: string,
  options?: UseMutationOptions
) => {
  const [lastSuccess, setLastSuccess] = useState(0);
  const queryClient = useQueryClient();
  const gameIndex = games.findIndex((game) => game.id === id);

  const result = useMutation({
    mutationFn: () => {
      if (gameIndex >= 0) {
        games[gameIndex].scores.push(games[gameIndex].players.map(() => null));

        queryClient.invalidateQueries({ queryKey: ["useGameById", id] });
      }
      return Promise.resolve();
    },
    ...options,
    onSuccess: (...args) => {
      setLastSuccess(new Date().getTime());
    },
  });

  return {
    ...result,
    lastSuccess,
  };
};

export const useCreateGameMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (partialGame: NewGame) => {
      const now = new Date();
      console.log(partialGame);
      const newGame: Game = {
        ...partialGame,
        id: uuid(),
        status: "in-progress",
        scores: [partialGame.players.map(() => null)],
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
