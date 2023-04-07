import {
  Dialog,
  DialogTitle,
  DialogContent,
  Radio,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useState } from "react";
import { useNewPlayerMutation } from "../hooks/usePlayers";

const colorOptions = [
  "#2f4f4f",
  "#2e8b57",
  "#800000",
  "#808000",
  "#00008b",
  "#ff4500",
  "#ffa500",
  "#7fff00",
  "#00fa9a",
  "#4169e1",
  "#00ffff",
  "#00bfff",
  "#0000ff",
  "#d8bfd8",
  "#ff00ff",
  "#fa8072",
  "#eee8aa",
  "#ffff54",
  "#ff1493",
  "#ee82ee",
];

type Props = {
  open: boolean;
  handleClose: () => void;
};

export const NewPlayerModal = ({ open, handleClose }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [name, setName] = useState("");
  const { mutateAsync } = useNewPlayerMutation();

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Player</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          id="standard-basic"
          label="Player name"
          variant="standard"
          onChange={(e) => setName(e.target.value)}
        />

        {colorOptions.map((color, index) => (
          <Radio
            key={color}
            checked={selectedIndex === index}
            onChange={() => setSelectedIndex(index)}
            value={color}
            name="player-color"
            sx={{
              color: color,
              "&.Mui-checked": {
                color: color,
              },
            }}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={async () => {
            const color = colorOptions[selectedIndex];
            const currentName = name;

            await mutateAsync({ color, name: currentName });
            setSelectedIndex(0);
            setName("");
            handleClose();
          }}
          autoFocus
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};
