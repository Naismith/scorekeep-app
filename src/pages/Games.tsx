"use client";

import {
  AppBar,
  Box,
  Container,
  Grid,
  IconButton,
  ListItem,
  Stack,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Paper,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import { useGamesQuery } from "../hooks/useGames";
import { Link, useNavigate } from "react-router-dom";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState } from "react";
import { GameStatus } from "../models";
import React from "react";

const PlayersPage = () => {
  const [filter, setFilter] = useState<GameStatus | null>(null);
  const { data: games } = useGamesQuery({
    select: (data) => {
      if (!filter) return data;

      return data.filter((g) => g.status === filter);
    },
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate();

  return (
    <>
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
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" noWrap>
              Game List
            </Typography>
          </Box>
          <IconButton
            onClick={handleClick}
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            <FilterListIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={() => setFilter(null)}>All games</MenuItem>
            <MenuItem onClick={() => setFilter("in-progress")}>
              In progress games
            </MenuItem>
            <MenuItem onClick={() => setFilter("finished")}>
              Finished games
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xs">
        <Stack spacing={2}>
          {(games || []).map((game, i) => (
            <React.Fragment key={game.id}>
              {i !== 0 && <Divider />}
              <Card onClick={() => navigate(`/game/${game.id}`)}>
                <CardContent>
                  <Typography>{game.title}</Typography>
                  <Typography>Created on: </Typography>
                </CardContent>
              </Card>
            </React.Fragment>
          ))}
        </Stack>
      </Container>
    </>
  );
};

export default PlayersPage;
