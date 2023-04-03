import {
  Box,
  Modal,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Radio,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import { useNewPlayerMutation } from "../hooks/usePlayers";

const colorOptions = [
  "#d3d3d3",
  "#2f4f4f",
  "#2e8b57",
  "#7f0000",
  "#808000",
  "#000080",
  "#ff0000",
  "#00ced1",
  "#ff8c00",
  "#ffd700",
  "#7cfc00",
  "#ba55d3",
  "#00fa9a",
  "#0000ff",
  "#f08080",
  "#ff00ff",
  "#1e90ff",
  "#f0e68c",
  "#dda0dd",
  "#ff1493",
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
