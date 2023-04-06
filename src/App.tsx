import { BrowserRouter, Routes, Route } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

import { GlobalStylesOverrides } from "./components/GlobalOverrides";

import HomePage from "./pages/Home";
import PlayersPage from "./pages/Players";
import GamesPage from "./pages/Games";
import CreateGame from "./pages/CreateGame";
import GameDetails from "./pages/GameDetails";

const queryClient = new QueryClient();
const theme = createTheme({ palette: { mode: "dark" } });

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {GlobalStylesOverrides}
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/game/:id" element={<GameDetails />} />
            <Route path="/new-game" element={<CreateGame />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/players" element={<PlayersPage />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
