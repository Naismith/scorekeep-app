import { NativeRouter, Route, Routes } from "react-router-native";

import PlayersScreen from "../pages/Players";
import HomeScreen from "../pages/Home";

export default function App() {
  return (
    <NativeRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/players" element={<PlayersScreen />} />
      </Routes>
    </NativeRouter>
  );
}
