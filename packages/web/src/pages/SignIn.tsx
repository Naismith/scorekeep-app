import { Auth } from "@supabase/auth-ui-react";
import { Link, Outlet } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useSession } from "../hooks/useSession";

const SignInPage = () => {
  const { session, loading } = useSession();
  const [email, setEmail] = useState("");

  const onClickLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: "localhost:5173",
      },
    });
  };

  if (loading) return null;

  if (session) {
    return <Outlet />;
  }

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Sign In
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
        />
      </Container>
      {/* <Container
        maxWidth="xs"
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <TextField
          type="email"
          value={email}
          label="Email"
          fullWidth
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 4 }}
        />
        <Button onClick={onClickLogin} variant="contained">
          Login
        </Button>
      </Container> */}
    </>
  );
};

export default SignInPage;
