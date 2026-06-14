import { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MESSAGE_THREADS } from "../../data/messages";

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const thread = MESSAGE_THREADS.find((t) => t.id === id);
  const [message, setMessage] = useState("");

  if (!thread) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>Conversation not found</Text>
      </View>
    );
  }

  const content = (
    <>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#050505" />
        </TouchableOpacity>
        <Image source={{ uri: thread.avatar }} style={styles.avatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{thread.name}</Text>
          <Text style={styles.headerStatus}>{thread.online ? "Active now" : "Offline"}</Text>
        </View>
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
          <Ionicons name="call-outline" size={22} color="#050505" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
          <Ionicons name="videocam-outline" size={22} color="#050505" />
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        data={[]}
        keyExtractor={(_item, i) => i.toString()}
        renderItem={() => null}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Image source={{ uri: thread.avatar }} style={styles.emptyAvatar} />
            <Text style={styles.emptyName}>{thread.name}</Text>
            <Text style={styles.emptyHint}>Say hello! 👋</Text>
          </View>
        }
      />

      <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
        <TouchableOpacity style={styles.plusBtn} activeOpacity={0.7}>
          <Ionicons name="add-circle" size={28} color="#1877F2" />
        </TouchableOpacity>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="Message..."
            placeholderTextColor="#8A8D91"
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.emojiBtn} activeOpacity={0.7}>
            <Ionicons name="happy-outline" size={22} color="#65676B" />
          </TouchableOpacity>
        </View>
        {message.trim() ? (
          <TouchableOpacity style={styles.sendBtn} activeOpacity={0.7}>
            <Ionicons name="send" size={20} color="#1877F2" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.likeBtn} activeOpacity={0.7}>
            <Ionicons name="thumbs-up-outline" size={24} color="#1877F2" />
          </TouchableOpacity>
        )}
      </View>
    </>
  );

  if (Platform.OS === "ios") {
    return <KeyboardAvoidingView style={styles.container} behavior="padding">{content}</KeyboardAvoidingView>;
  }
  return <View style={styles.container}>{content}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  errorText: { fontSize: 16, color: "#65676B", textAlign: "center", marginTop: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#CED0D4",
    gap: 10,
  },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 16, fontWeight: "700", color: "#050505" },
  headerStatus: { fontSize: 12, color: "#65676B" },
  headerBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  messagesList: { flex: 1 },
  messagesContent: { flexGrow: 1, paddingHorizontal: 16, paddingVertical: 20 },
  emptyWrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 80 },
  emptyAvatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 12 },
  emptyName: { fontSize: 18, fontWeight: "700", color: "#050505", marginBottom: 4 },
  emptyHint: { fontSize: 14, color: "#65676B" },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: "#CED0D4",
    gap: 8,
  },
  plusBtn: { width: 28, height: 28, alignItems: "center", justifyContent: "center" },
  inputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F2F5",
    borderRadius: 20,
    paddingHorizontal: 14,
  },
  input: { flex: 1, fontSize: 15, color: "#050505", paddingVertical: 8 },
  emojiBtn: { marginLeft: 4 },
  sendBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  likeBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
});
