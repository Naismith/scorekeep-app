import { usePlayersQuery } from "../hooks/usePlayers";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Stack,
  Box,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddCircle from "@mui/icons-material/AddCircle";
import { NewPlayerModal } from "../components/NewPlayerModal";
import { useState } from "react";
import { Link } from "react-router-dom";

const PlayersPage = () => {
  const { data, isSuccess } = usePlayersQuery();
  const [showNewPlayer, setShowNewPlayer] = useState(false);
  return (
    <>
      <NewPlayerModal
        open={showNewPlayer}
        handleClose={() => setShowNewPlayer(false)}
      />
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            component={Link}
            to="/"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Player List
          </Typography>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setShowNewPlayer(true)}
          >
            <AddCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xs">
        <Stack spacing={2}>
          {isSuccess &&
            data.map((player) => (
              <Box
                key={player.id}
                style={{ display: "flex", alignItems: "center" }}
              >
                <span
                  style={{
                    display: "block",
                    borderRadius: "50%",
                    height: "1em",
                    width: "1em",
                    marginRight: "1em",
                    backgroundColor: player.color,
                  }}
                />
                <h3 style={{ margin: 0 }}>{player.name}</h3>
              </Box>
            ))}
        </Stack>
      </Container>
    </>
  );
};

export default PlayersPage;
