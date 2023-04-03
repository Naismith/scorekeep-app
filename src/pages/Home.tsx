import { Link } from "react-router-dom";
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
import { useState } from "react";

const Home = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setOpenDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Score Keeper
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        test
      </Drawer>
      <Container maxWidth="xs">
        <Button
          component={Link}
          to="/new-game"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
        >
          Create a new game
        </Button>
        <Button
          component={Link}
          to="/games"
          fullWidth
          variant="contained"
          color="secondary"
          sx={{ mb: 2 }}
        >
          Game list
        </Button>
        <Button component={Link} to="/players" fullWidth variant="contained">
          Player List
        </Button>
      </Container>
    </>
  );
};

export default Home;
