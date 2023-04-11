import { Link } from "react-router-dom";
import {
  AppBar,
  Button,
  Container,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";
import { useLogout } from "../hooks/useSession";
import { supabase } from "../supabaseClient";

const Home = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const logout = useLogout();
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
        <Box sx={{ width: 250 }} onClick={() => setOpenDrawer(false)}>
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => supabase.auth.signOut()}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary={"Logout"} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Container
        maxWidth="xs"
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          height: "100%",
        }}
      >
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
