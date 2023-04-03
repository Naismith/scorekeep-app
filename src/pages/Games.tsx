import { Container, Grid, List, ListItem } from "@mui/material";
import { useGamesQuery } from "../hooks/useGames";
import { usePlayersQuery } from "../hooks/usePlayers";
import type { Player } from "../models";

const PlayersPage = () => {
  const { data, isSuccess } = usePlayersQuery();
  const { data: games } = useGamesQuery();
  return (
    <>
      <h1>Games</h1>
      <Container maxWidth="xs">
        <List>
          {(games || []).map((game) => (
            <ListItem key={game.id}>
              <Grid container>
                <Grid item xs={8}>
                  {game.title}
                </Grid>
                <Grid item xs={4}>
                  Created at{" "}
                  {game.createdAt.toLocaleTimeString("en-us", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </List>
      </Container>
    </>
  );
};

export default PlayersPage;
