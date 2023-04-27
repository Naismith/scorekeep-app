import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useNavigate } from "react-router-native";

const HomeScreen = () => {
  const navigate = useNavigate();
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Text onPress={() => navigate("/players")}>Again</Text>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeScreen;
