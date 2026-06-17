import { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, Animated, Platform, Keyboard, KeyboardEvent, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../theme/ThemeContext";
import { MESSAGE_THREADS } from "../../data/messages";
import Avatar from "../../components/Avatar";

type Msg = { text: string; time: string; sent: boolean };

export default function ChatScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const thread = MESSAGE_THREADS.find((t) => t.id === id);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const kb = useRef(new Animated.Value(0)).current;
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    const show = Keyboard.addListener(Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow", (e: KeyboardEvent) => {
      Animated.timing(kb, { toValue: e.endCoordinates.height, duration: 250, useNativeDriver: true }).start();
    });
    const hide = Keyboard.addListener(Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide", () => {
      Animated.timing(kb, { toValue: 0, duration: 250, useNativeDriver: true }).start();
    });
    return () => { show.remove(); hide.remove(); };
  }, []);

  const sendMsg = () => {
    const text = message.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { text, time: "Just now", sent: true }]);
    setMessage("");
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  if (!thread) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <Text style={[styles.errorText, { color: colors.textSecondary }]}>Conversation not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8, borderBottomColor: colors.border, backgroundColor: colors.card }]}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Avatar uri={thread.avatar} size={36} style={styles.avatar} />
        <View style={styles.headerInfo}>
          <Text style={[styles.headerName, { color: colors.text }]}>{thread.name}</Text>
          <Text style={[styles.headerStatus, { color: colors.textSecondary }]}>{thread.online ? "Active now" : "Offline"}</Text>
        </View>
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
          <Ionicons name="call-outline" size={22} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
          <Ionicons name="videocam-outline" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={Keyboard.dismiss}>
        <FlatList
          ref={listRef}
          style={styles.messagesList}
          contentContainerStyle={messages.length === 0 ? styles.messagesContent : { paddingHorizontal: 16, paddingVertical: 12 }}
          data={messages}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <View style={[styles.msgBubble, { backgroundColor: colors.inputBg, alignSelf: "flex-start", borderBottomLeftRadius: 4, borderBottomRightRadius: 18 }, item.sent && { backgroundColor: colors.primary, alignSelf: "flex-end", borderBottomLeftRadius: 18, borderBottomRightRadius: 4 }]}>
              <Text style={[styles.msgText, { color: colors.text }, item.sent && { color: colors.white }]}>{item.text}</Text>
              <Text style={[styles.msgTime, { color: colors.textSecondary }, item.sent && { color: "rgba(255,255,255,0.7)" }]}>{item.time}</Text>
            </View>
          )}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Avatar uri={thread.avatar} size={80} style={styles.emptyAvatar} />
              <Text style={[styles.emptyName, { color: colors.text }]}>{thread.name}</Text>
              <Text style={[styles.emptyHint, { color: colors.textSecondary }]}>Say hello!</Text>
            </View>
          }
        />
      </TouchableOpacity>

      <Animated.View style={[styles.inputBar, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: insets.bottom + 8, transform: [{ translateY: kb.interpolate({ inputRange: [0, 500], outputRange: [0, -500], extrapolate: "clamp" }) }] }]}>
        <TouchableOpacity style={styles.plusBtn} activeOpacity={0.7}>
          <Ionicons name="add-circle" size={28} color={colors.primary} />
        </TouchableOpacity>
        <View style={[styles.inputWrap, { backgroundColor: colors.inputBg }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Message..."
            placeholderTextColor={colors.textTertiary}
            value={message}
            onChangeText={setMessage}
            returnKeyType="send"
            onSubmitEditing={sendMsg}
          />
          <TouchableOpacity style={styles.emojiBtn} activeOpacity={0.7}>
            <Ionicons name="happy-outline" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        {message.trim() ? (
          <TouchableOpacity style={styles.sendBtn} activeOpacity={0.7} onPress={sendMsg}>
            <Ionicons name="send" size={20} color={colors.primary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.likeBtn} activeOpacity={0.7}>
            <Ionicons name="thumbs-up-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  errorText: { fontSize: 16, textAlign: "center", marginTop: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    gap: 10,
  },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 16, fontWeight: "700" },
  headerStatus: { fontSize: 12 },
  headerBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  messagesList: { flex: 1 },
  messagesContent: { flexGrow: 1, paddingHorizontal: 16, paddingVertical: 20 },
  emptyWrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 80 },
  emptyAvatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 12 },
  emptyName: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  emptyHint: { fontSize: 14 },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 8,
    borderTopWidth: 0.5,
    gap: 8,
  },
  plusBtn: { width: 28, height: 28, alignItems: "center", justifyContent: "center" },
  inputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 14,
  },
  input: { flex: 1, fontSize: 15, paddingVertical: 8 },
  emojiBtn: { marginLeft: 4 },
  sendBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  likeBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  msgBubble: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 6,
    maxWidth: "80%",
  },
  msgText: { fontSize: 15 },
  msgTime: { fontSize: 11, marginTop: 2, alignSelf: "flex-end" },
});
