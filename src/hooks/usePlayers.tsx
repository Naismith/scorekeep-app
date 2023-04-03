import { Player, NewPlayer } from "../models";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { v4 as uuid } from "uuid";

let players: Player[] = [
  {
    id: "ae6b659b-b2bf-4acc-b816-53705c0d0f60",
    name: "Chris",
    color: "#dc10ab",
  },
  {
    id: "0a0b2087-866c-46a7-aecc-cfbe4260b7d8",
    name: "Rebecca",
    color: "#a0c8e4",
  },
];

export let getPlayers = Promise.resolve(players);

export const usePlayersQuery = () => {
  return useQuery({ queryKey: ["usePlayers"], queryFn: () => getPlayers });
};

export const useNewPlayerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (partialPlayer: NewPlayer) => {
      const player = { ...partialPlayer, id: uuid() };

      players.push(player);

      queryClient.invalidateQueries({ queryKey: ["usePlayers"] });

      return Promise.resolve();
    },
  });
};
