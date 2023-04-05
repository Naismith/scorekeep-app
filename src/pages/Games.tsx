import {
  AppBar,
  Box,
  Container,
  Grid,
  IconButton,
  List,
  ListItem,
  Stack,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import { useGamesQuery } from "../hooks/useGames";
import { usePlayersQuery } from "../hooks/usePlayers";
import { Link, useNavigate } from "react-router-dom";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRef, useState } from "react";

const PlayersPage = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate();
  const { data, isSuccess } = usePlayersQuery();
  const { data: games } = useGamesQuery();
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
            <MenuItem>All games</MenuItem>
            <MenuItem>In progress games</MenuItem>
            <MenuItem>Finished games</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xs">
        <Stack spacing={2}>
          {(games || []).map((game) => (
            <ListItem
              onClick={() => navigate(`/game/${game.id}`)}
              key={game.id}
            >
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
        </Stack>
      </Container>
    </>
  );
};

export default PlayersPage;
