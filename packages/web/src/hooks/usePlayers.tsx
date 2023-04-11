import { Player, NewPlayer } from "../models";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabaseClient";
import { useSession } from "./useSession";

export const usePlayersQuery = () => {
  return useQuery<Player[]>({
    queryKey: ["usePlayers"],
    queryFn: async () => {
      const { data } = await supabase.from("players").select("*");

      return data || [];
    },
  });
};

export const useDeletePlayerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: Player["id"]) => {
      const { error } = await supabase.from("players").delete().eq("id", id);

      if (!error) {
        queryClient.setQueriesData<Player[]>(["usePlayers"], (oldPlayers) =>
          oldPlayers
            ? oldPlayers.filter((player) => player.id !== id)
            : oldPlayers
        );
      }
    },
  });
};

export const useNewPlayerMutation = () => {
  const queryClient = useQueryClient();
  const { session } = useSession();

  return useMutation({
    mutationFn: async (partialPlayer: NewPlayer) => {
      const player = {
        ...partialPlayer,
        user_id: session?.user.id,
      } as Player;

      const { data } = await supabase.from("players").insert(player).select();

      if (data) {
        queryClient.setQueryData<Player[]>(["usePlayers"], (oldPlayers) => {
          return oldPlayers ? [...oldPlayers, ...data] : oldPlayers;
        });
      }

      return Promise.resolve();
    },
  });
};
