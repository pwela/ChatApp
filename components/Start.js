import { useState, useEffect } from "react";
import { getAuth, signInAnonymously } from "firebase/auth";
import {
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
const Start = ({ navigation }) => {
  //Initialize Firebase Authentication handler
  const auth = getAuth();

  // Allow the user to sign in anonymously
  const signInUser = () => {
    signInAnonymously(auth)
      .then((result) => {
        navigation.navigate("Chat", {
          userID: result.user.uid,
          name: name,
          color: color,
        });
        Alert.alert("Signed in Successfully!");
      })
      .catch((error) => {
        Alert.alert("Unable to sign in, try later again.");
      });
  };

  // state variables for username and background color
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  // Chat theme colors palette
  const colors = ["#090C08", "#474056", "#8A95A5", "#B9C6AE"];
  return (
    <ImageBackground
      source={require("../img/Background_Image.png")}
      resizeMode="cover"
      style={styles.imageBackground}
    >
      <View style={styles.appTitleContainer}>
        <Text style={styles.appTitle}>Chat App!</Text>
      </View>
      <View style={styles.userZone}>
        <TextInput
          style={styles.yourName}
          value={name}
          onChangeText={setName}
          placeholder="Your Name"
          accessible={true}
          accessibilityLabel="Enter username"
          accessibilityHint="Enter the that will appear in the chat"
          accessibilityRole="text"
        />
        <View style={styles.backgroundColorContainer}>
          <Text style={styles.backgroundColorText}>
            Choose Background Color:
          </Text>
          <View style={styles.colorContainter}>
            {colors.map((color) => (
              <TouchableOpacity
                key={colors.indexOf(color)}
                style={[styles.colorLayout, { backgroundColor: color }]}
                onPress={() => setColor(color)}
                accessible={true}
                accessibilityLabel="Select color"
                accessibilityHint="Lets you choose a backgound color for you App"
                accessibilityRole="button"
              />
            ))}
          </View>
        </View>
        <TouchableOpacity
          onPress={signInUser}
          style={styles.startChattingContainer}
          accessible={true}
          accessibilityLabel="Start chatting"
          accessibilityHint="Enter in a chat conversation"
          accessibilityRole="button"
        >
          <Text style={styles.startChattingText}>Start Chatting</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  appTitleContainer: {
    flex: 50,
    alignItems: "center",
  },
  appTitle: {
    marginTop: 100,
    fontSize: 45,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  userZone: {
    width: "88%",
    flex: 44,
    marginBottom: "6%",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    position: "sticky",
    borderRadius: 10,
  },
  backgroundColorContainer: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "flex-start",
    paddingStart: "6%",
  },
  backgroundColorText: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    opacity: 1,
    margin: "auto",
  },
  colorContainter: {
    flexDirection: "row",
  },
  colorLayout: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    marginTop: "auto",
    marginBottom: "auto",
    "@media (min-height: 300px) ": {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
  },

  yourName: {
    width: "88%",
    padding: 15,
    borderWidth: 2,
    marginTop: 15,
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    opacity: 0.5,
    borderRadius: 2,
  },
  startChattingContainer: {
    width: "88%",
    padding: 15,
    marginTop: "auto",
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#757083",
  },

  startChattingText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Start;
