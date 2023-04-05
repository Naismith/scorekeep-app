import {
  AppBar,
  Box,
  Container,
  FormControlLabel,
  IconButton,
  Switch,
  TextField,
  Toolbar,
  Typography,
  getContrastRatio,
  List,
  ListItem,
  Avatar,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckIcon from "@mui/icons-material/Check";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link, useNavigate } from "react-router-dom";
import { usePlayersQuery } from "../hooks/usePlayers";
import { Player } from "../models";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCreateGameMutation } from "../hooks/useGames";
import AddIcon from "@mui/icons-material/Add";
import { NewPlayerModal } from "../components/NewPlayerModal";

enum StepEnum {
  Create = 0,
  Players = 1,
}

const toolbarSubText: Record<StepEnum, string> = {
  [StepEnum.Create]: "Please enter game parameters",
  [StepEnum.Players]: "Select players for this game",
};
const CreateGame = () => {
  const navigate = useNavigate();
  const { data: players, isLoading, isSuccess } = usePlayersQuery();
  const [activeStep, setActiveStep] = useState(StepEnum.Create);
  const [selectedPlayers, setSelectedPlayers] = useState([] as Player[]);
  const { mutateAsync } = useCreateGameMutation();
  const [reversedScoring, setReversedScoring] = useState(false);
  const [showInterm, setShowInterm] = useState(true);
  const [showRounds, setShowRounds] = useState(true);
  const [gameTitle, setGameTitle] = useState("");
  const [maxScore, setMaxScore] = useState("");
  const [maxRounds, setMaxRounds] = useState("");
  const [showNewPlayer, setShowNewPlayer] = useState(false);

  const selectedPlayerIds = selectedPlayers.map((player) => player.id);

  const nonSelectedPlayers = (players || []).filter(
    (player) => !selectedPlayerIds.includes(player.id)
  );

  const isStep = (step: StepEnum) => step === activeStep;

  const addPlayer = (player: Player) => {
    setSelectedPlayers((p) => [...p, player]);
  };

  const deletePlayer = (player: Player) =>
    setSelectedPlayers((p) => p.filter((p) => p !== player));

  const CreateStep = (
    <Box
      display="flex"
      height="100%"
      alignItems="center"
      justifyContent="center"
    >
      <Container maxWidth="xs">
        <TextField
          fullWidth
          label="Game title"
          value={gameTitle}
          onChange={(e) => setGameTitle(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Max score (optional)"
          type="number"
          value={maxScore}
          onChange={(e) => setMaxScore(e.target.value)}
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Count of game rounds (optional)"
          type="number"
          value={maxRounds}
          onChange={(e) => setMaxRounds(e.target.value)}
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          sx={{ mb: 2 }}
        />
        <FormControlLabel
          label="Reversed Scoring"
          labelPlacement="start"
          control={
            <Switch
              checked={reversedScoring}
              onChange={(e) => setReversedScoring(e.target.checked)}
            />
          }
          sx={{ width: "100%", justifyContent: "space-between", mb: 2 }}
        />

        <FormControlLabel
          label="Show interim results"
          labelPlacement="start"
          control={
            <Switch
              checked={showInterm}
              onChange={(e) => setShowInterm(e.target.checked)}
            />
          }
          sx={{ width: "100%", justifyContent: "space-between", mb: 2 }}
        />

        <FormControlLabel
          label="Show game rounds"
          labelPlacement="start"
          control={
            <Switch
              checked={showRounds}
              onChange={(e) => setShowRounds(e.target.checked)}
            />
          }
          sx={{ width: "100%", justifyContent: "space-between", mb: 2 }}
        />
      </Container>
    </Box>
  );

  const PlayersSelect = (
    <>
      <NewPlayerModal
        open={showNewPlayer}
        handleClose={() => setShowNewPlayer(false)}
      />
      <Container
        sx={{ display: "flex", flexDirection: "column", height: "100%" }}
        maxWidth="xs"
      >
        {selectedPlayers.length === 0 ? (
          <Box
            flexGrow={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            Select players for this game
          </Box>
        ) : (
          <Box flexGrow={1}>
            <List>
              {selectedPlayers.map((player) => (
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: player.color }}> </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={player.name} />
                  <IconButton onClick={() => deletePlayer(player)}>
                    <DeleteIcon sx={{ color: "#ccc" }} />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        <Box maxHeight="300px" flexWrap="wrap" display="flex">
          <Box
            width="calc(100% / 3)"
            textAlign="center"
            height="35px"
            onClick={() => setShowNewPlayer(true)}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "black",
            }}
          >
            <AddIcon sx={{ fontSize: "1.5em", color: "#1EC73B", mr: 1 }} />
            New player
          </Box>
          {(nonSelectedPlayers || []).map((player) => (
            <Box
              key={player.id}
              width="calc(100% / 3)"
              textAlign="center"
              height="35px"
              onClick={() => addPlayer(player)}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: player.color,
                color:
                  getContrastRatio("#ffffff", player.color) >= 3
                    ? "#fff"
                    : "#000",
              }}
            >
              {player.name}
            </Box>
          ))}
        </Box>
      </Container>
    </>
  );

  const TopBar = (
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
            Create Game
          </Typography>
          <Typography>{toolbarSubText[activeStep]}</Typography>
        </Box>
        <IconButton
          onClick={async () => {
            if (isStep(StepEnum.Create)) setActiveStep(StepEnum.Players);
            if (isStep(StepEnum.Players)) {
              const newGame = await mutateAsync({
                title: "",
                reversedScoring: reversedScoring,
                showGameResults: showRounds,
                showInterimResults: showInterm,
                players: selectedPlayers,
              });
              setSelectedPlayers([]);
              navigate(`/game/${newGame.id}`);
            }
          }}
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <NavigateNextIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );

  if (isLoading) {
    return (
      <>
        {TopBar}
        Loading...
      </>
    );
  }

  if (!isSuccess) {
    return (
      <>
        {TopBar}
        Error
      </>
    );
  }

  return (
    <>
      {TopBar}
      {isStep(StepEnum.Create) && CreateStep}
      {isStep(StepEnum.Players) && PlayersSelect}
    </>
  );
};

export default CreateGame;
