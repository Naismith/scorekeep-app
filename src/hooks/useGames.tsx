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

let games: Game[] = [
  {
    reversedScoring: true,
    showInterimResults: true,
    showGameResults: true,
    id: "abc",
    title: "Example",
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
  },
];

const getGames = () => Promise.resolve(games);

export const useGamesQuery = () => {
  return useQuery({
    queryKey: ["useGamesQuery"],
    queryFn: getGames,
  });
};

export const useGameByIdQuery = (id: string, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ["useGameById", id],
    queryFn: () => Promise.resolve(games[0]),
  });
};

export const useUpdateRowMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ rowIndex, row }: { rowIndex: number; row: Score }) => {
      games[0].scores[rowIndex] = row;

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

  const result = useMutation({
    mutationFn: () => {
      games[0].scores.push(games[0].players.map(() => null));

      queryClient.invalidateQueries({ queryKey: ["useGameById", id] });

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
