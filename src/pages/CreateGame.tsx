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
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link, useNavigate } from "react-router-dom";
import { usePlayersQuery } from "../hooks/usePlayers";
import { Player } from "../models";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCreateGameMutation } from "../hooks/useGames";
import AddIcon from "@mui/icons-material/Add";
import { NewPlayerModal } from "../components/NewPlayerModal";
import { useForm } from "react-hook-form";

enum StepEnum {
  Create = 0,
  Players = 1,
}

const toolbarSubText: Record<StepEnum, string> = {
  [StepEnum.Create]: "Please enter game parameters",
  [StepEnum.Players]: "Select players for this game",
};

type FormData = {
  title: string;
  maxScore: string;
  countOfGameRounds: string;
  showGameRounds: boolean;
  showInterimResults: boolean;
  reversedScoring: boolean;
};

const CreateGame = () => {
  const navigate = useNavigate();
  const { register, getValues, watch } = useForm<FormData>({});
  const { data: players, isLoading, isSuccess } = usePlayersQuery();
  const [activeStep, setActiveStep] = useState(StepEnum.Create);
  const [selectedPlayers, setSelectedPlayers] = useState([] as Player[]);
  const { mutateAsync } = useCreateGameMutation();

  // console.log(watch());
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
    <>
      <Container maxWidth="xs">
        <TextField
          fullWidth
          label="Game title"
          required
          {...register("title", { required: true })}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Max score (optional)"
          type="number"
          {...register("maxScore")}
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Count of game rounds (optional)"
          type="number"
          {...register("countOfGameRounds")}
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          sx={{ mb: 2 }}
        />
        <FormControlLabel
          label="Reversed Scoring"
          labelPlacement="start"
          control={
            <Switch defaultChecked={false} {...register("reversedScoring")} />
          }
          sx={{ width: "100%", justifyContent: "space-between", mb: 2 }}
        />

        <FormControlLabel
          label="Show interim results"
          labelPlacement="start"
          control={
            <Switch defaultChecked={true} {...register("showInterimResults")} />
          }
          sx={{ width: "100%", justifyContent: "space-between", mb: 2 }}
        />

        <FormControlLabel
          label="Show game rounds"
          labelPlacement="start"
          control={
            <Switch defaultChecked={true} {...register("showGameRounds")} />
          }
          sx={{ width: "100%", justifyContent: "space-between", mb: 2 }}
        />
      </Container>
    </>
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
                <ListItem key={player.id}>
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
              const values = getValues();
              const newGame = await mutateAsync({
                title: values.title,
                reversedScoring: values.reversedScoring,
                showGameRounds: values.showGameRounds,
                showInterimResults: values.showInterimResults,
                countOfGameRounds:
                  Number(values.countOfGameRounds) || undefined,
                maxScore: Number(values.maxScore) || undefined,

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
      <Box
        display="flex"
        height="100%"
        alignItems="center"
        justifyContent="center"
      >
        {isStep(StepEnum.Create) && CreateStep}
        {isStep(StepEnum.Players) && PlayersSelect}
      </Box>
    </>
  );
};

export default CreateGame;
