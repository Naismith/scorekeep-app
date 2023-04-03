import { usePlayersQuery } from "../hooks/usePlayers";
import type { Player } from "../models";
import {
  AppBar,
  Button,
  Box,
  Container,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddCircle from "@mui/icons-material/AddCircle";
import { NewPlayerModal } from "../components/NewPlayerModal";
import { useState } from "react";

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
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => {}}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Score Keeper
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
      <h1>Players</h1>
      <ul>
        {isSuccess &&
          data.map((player) => (
            <li
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
            </li>
          ))}
      </ul>
    </>
  );
};

export default PlayersPage;
