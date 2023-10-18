import { useState, useEffect } from "react";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { StyleSheet, View, Text, KeyboardAvoidingView } from "react-native";

const Chat = ({ route, navigation }) => {
  // extract props from navigation
  const { name } = route.params;
  const { color } = route.params;
  // Msg statate initialisation
  const [messages, setMessages] = useState([]);

  // send a message
  const onSend = (newMessages) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
  };

  // function to render bubble
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
          },
          left: {
            backgroundColor: "#FFF",
          },
        }}
      />
    );
  };
  useEffect(() => {
    navigation.setOptions({ title: name });
    // static messages
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://picsum.photos/id/237/200/300",
        },
      },
      // system message
      {
        _id: 2,
        text: "You have entered the chat",
        createdAt: new Date(),
        system: true,
      },
    ]);
  }, []);
  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
        accessible={true}
        accessibilityLabel="Chat window"
        accessibilityHint="Discussion feed"
        accessibilityRole="text"
      />
      {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    //alignItems: "center",
  },
  helloText: {
    fontWeight: "400",
    fontSize: 25,
    color: "white",
  },
});
export default Chat;
