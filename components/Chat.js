import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import MapView from "react-native-maps";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import CustomActions from "./CustomActions";
import {
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  query,
  orderBy,
  setDoc,
} from "firebase/firestore";
import { Audio } from "expo-av";

const Chat = ({ route, navigation, db, isConnected, storage }) => {
  // extract props from navigation
  const { name } = route.params;
  const { userID } = route.params;
  const { color } = route.params;

  // Currently played sound object
  let soundObject = null;
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

  // Render action button
  const renderCustomActions = (props) => {
    return <CustomActions userID={userID} storage={storage} {...props} />;
  };

  // Render Location
  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }

    return null;
  };

  // Render audio
  const renderAudioBubble = (props) => {
    return (
      <View {...props}>
        <TouchableOpacity
          style={{ backgroundColor: "#FF0", borderRadius: 10, margin: 5 }}
          onPress={async () => {
            if (soundObject) soundObject.unloadAsync();
            const { sound } = await Audio.Sound.createAsync({
              uri: props.currentMessage.audio,
            });
            await sound.playAsync();
          }}
        >
          <Text style={{ textAlign: "center", color: "black", padding: 5 }}>
            Play Sound
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  // Load cached messages

  const loadCachedMessages = async () => {
    const cachedMessages = (await AsyncStorage.getItem("messages")) || [];
    setMessages(JSON.parse(cachedMessages));
  };

  // Add messages to cache
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
      if (soundObject) soundObject.unloadAsync();
    };
  }, [isConnected]);

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        renderMessageAudio={renderAudioBubble}
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
