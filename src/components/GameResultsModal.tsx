import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  getContrastRatio,
} from "@mui/material";
import { Game } from "../models";
import { useGameTotalsQuery } from "../hooks/useGames";

type Props = {
  open: boolean;
  onClose: () => void;
  game: Game;
};
export const GameResultsModal = ({ open, onClose, game }: Props) => {
  const totals = useGameTotalsQuery(game.id);

  let scoreRef: Record<string, number> = {};

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Results</DialogTitle>
      <DialogContent>
        {totals.map(([score, player], i) => {
          if (!scoreRef[score]) scoreRef[score] = i + 1;

          const place = scoreRef[score];

          return (
            <Box display="flex" alignItems="center" mb={2}>
              <Box
                sx={{
                  backgroundColor: player.color,
                  color:
                    getContrastRatio("#ffffff", player.color || "#000") >= 3
                      ? "#fff"
                      : "#000",
                  borderRadius: "50%",
                  display: "flex",
                  width: "2em",
                  height: "2em",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  mr: 1,
                }}
              >
                #{place}
              </Box>
              <Typography sx={{ flexGrow: 1 }}>{player.name}</Typography>
              <Typography>{score}</Typography>
            </Box>
          );
        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {/* <Button>Play Again</Button> */}
      </DialogActions>
    </Dialog>
  );
};
