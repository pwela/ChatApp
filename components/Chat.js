import { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";

const Chat = ({ route, navigation }) => {
  // extract props from navigation
  const { name } = route.params;
  const { color } = route.params;
  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);
  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <Text style={styles.helloText}>Hello Screen2!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  helloText: {
    fontWeight: "400",
    fontSize: 25,
    color: "white",
  },
});
export default Chat;
