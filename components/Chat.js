import { useState, useEffect } from "react";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { StyleSheet, View, Text, KeyboardAvoidingView } from "react-native";
import {
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  query,
  orderBy,
  setDoc,
} from "firebase/firestore";

const Chat = ({ route, navigation, db }) => {
  // extract props from navigation
  const { name } = route.params;
  const { userID } = route.params;
  const { color } = route.params;
  // Msg statate initialisation
  const [messages, setMessages] = useState([]);

  // send a message
  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
    // setMessages((previousMessages) =>
    //   GiftedChat.append(previousMessages, newMessages)
    // );
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
    const unsubMessages = onSnapshot(
      query(collection(db, "messages"), orderBy("createdAt", "desc")),
      (documentsSnapshot) => {
        let newMessages = [];
        documentsSnapshot.forEach((doc) => {
          newMessages.push({ id: doc.id, ...doc.data() });
        });
        let convertedMessages = [];
        newMessages.forEach((message) => {
          message.createdAt = Date(message.createdAt);
          convertedMessages.push(message);
        });
        setMessages(convertedMessages);
      }
    );

    // Clean up code
    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, []);
  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userID,
          name: name,
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
