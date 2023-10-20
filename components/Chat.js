import { useState, useEffect } from "react";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

const Chat = ({ route, navigation, db, isConnected }) => {
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

  // funtion to render input toolbar
  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  };

  // Load cached messages

  const loadCachedMessages = async () => {
    const cachedMessages = (await AsyncStorage.getItem("messages")) || [];
    setMessages(JSON.parse(cachedMessages));
  };

  // Add messages to cahche
  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };

  let unsubMessages;
  useEffect(() => {
    navigation.setOptions({ title: name });

    if (isConnected === true) {
      // unregister current onSnapshot() listener to avoid registering multiple listeners when
      // useEffect code is re-executed.
      if (unsubMessages) unsubMessages();
      unsubMessages = null;

      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      unsubMessages = onSnapshot(q, (documentsSnapshot) => {
        let newMessages = [];
        documentsSnapshot.forEach((doc) => {
          newMessages.push({ id: doc.id, ...doc.data() });
        });

        let convertedMessages = [];
        newMessages.forEach((message) => {
          message.createdAt = Date(message.createdAt);
          convertedMessages.push(message);
        });
        cacheMessages(convertedMessages);
        setMessages(convertedMessages);
      });
    } else loadCachedMessages();

    // Clean up code
    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, [isConnected]);

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
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
