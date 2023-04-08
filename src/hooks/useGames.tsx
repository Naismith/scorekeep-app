import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Game, Score, Player, GameWithPlayers, NewGame } from "../models";
import { useMemo, useState } from "react";
import { supabase } from "../supabaseClient";
import { useSession } from "./useSession";

export const useGamesQuery = (options?: UseQueryOptions<Game[]>) => {
  return useQuery({
    queryKey: ["useGamesQuery"],
    queryFn: async () => {
      const { data, error } = await supabase.from("games").select(`
        *, 
        players ( 
          * 
        )
      `);

      if (error) throw error;

      return data as Game[];
    },
  });
};

export const useGameTotalsQuery = (id: Game["id"]) => {
  const { data: game, ...rest } = useGameByIdQuery(id);

  const totals = useMemo(() => {
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
  }, [game]);

  return { ...rest, data: totals };
};

export const useFinishGameMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await supabase.from("games").update({ status: "finished" }).match({ id });
      queryClient.invalidateQueries({ queryKey: ["useGameById", id] });

      return;
    },
  });
};

export const useGameByIdQuery = (
  id: Game["id"],
  options?: UseQueryOptions<GameWithPlayers>
) => {
  return useQuery({
    queryKey: ["useGameById", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("games")
        .select(
          `
        *,
        players ( 
          * 
        )
      `
        )
        .match({ id })
        .limit(1)
        .single();

      if (error) throw error;

      return data as GameWithPlayers;
    },
    ...options,
  });
};

export const useUpdateRowMutation = (id: Game["id"]) => {
  const queryClient = useQueryClient();
  const { data: game } = useGameByIdQuery(id);

  return useMutation({
    mutationFn: async ({ rowIndex, row }: { rowIndex: number; row: Score }) => {
      if (game) {
        const currentScore = game.scores;
        currentScore[rowIndex] = row;

        const { data } = await supabase
          .from("games")
          // @ts-ignore
          .update({ scores: currentScore })
          .match({ id });
      }

      queryClient.invalidateQueries({ queryKey: ["useGameById", id] });

      return Promise.resolve();
    },
  });
};

const toArray = <T,>(val: T | undefined): T[] => {
  if (val === undefined) return [];
  return Array.isArray(val) ? val : [val];
};

export const useCreateNewRowMutation = (
  id: Game["id"],
  options?: UseMutationOptions
) => {
  const [lastSuccess, setLastSuccess] = useState(0);
  const queryClient = useQueryClient();

  const { data: game } = useGameByIdQuery(id);

  const result = useMutation({
    mutationFn: async () => {
      if (game) {
        const newRow = toArray(game.players).map(() => null);
        const { data } = await supabase
          .from("games")
          // @ts-ignore
          .update({ scores: [...game.scores, newRow] })
          .match({ id: id });

        queryClient.setQueriesData<Game>(["useGameById", id], (game) => {
          return game ? { ...game, scores: [...game.scores, newRow] } : game;
        });
      }

      return;
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
  const { session } = useSession();

  return useMutation({
    mutationFn: async ({
      game,
      players,
    }: {
      game: NewGame;
      players: Player[];
    }) => {
      const newGame = {
        ...game,
        user_id: session?.user.id || null,
        status: "inprogress",
        scores: [players.map(() => null)],
        created_at: new Date().toISOString(),
      } as Game;

      const { data: createdGame, error } = await supabase
        .from("games")
        .insert(newGame)
        .select()
        .limit(1)
        .single();

      if (error) throw error;

      const { data: createdPlayers } = await supabase
        .from("games_players")
        .insert(
          players.map((player) => ({
            user_id: session?.user.id,
            player: player.id,
            game: createdGame.id,
          }))
        )
        .select();

      return createdGame;
    },
  });
};
