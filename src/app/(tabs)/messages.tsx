import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native";
import { MESSAGE_THREADS } from "../../data/messages";
import ProfileSidebar from "../../components/ProfileSidebar";

export default function MessagesScreen() {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7} onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu-outline" size={22} color="#050505" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
            <Ionicons name="search" size={20} color="#050505" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
            <Ionicons name="settings-outline" size={20} color="#050505" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={MESSAGE_THREADS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.thread} activeOpacity={0.7}>
            <View style={styles.avatarWrap}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              {item.online && <View style={styles.onlineDot} />}
            </View>
            <View style={styles.threadInfo}>
              <Text style={styles.threadName}>{item.name}</Text>
              <Text style={styles.threadMessage} numberOfLines={1}>{item.lastMessage}</Text>
            </View>
            <View style={styles.threadRight}>
              <Text style={styles.threadTime}>{item.time}</Text>
              {item.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unread}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
      <ProfileSidebar visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#CED0D4",
  },
  headerTitle: { fontSize: 24, fontWeight: "700", color: "#050505" },
  headerRight: { flexDirection: "row", gap: 8 },
  headerBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#E4E6EB", alignItems: "center", justifyContent: "center" },
  thread: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  avatarWrap: { position: "relative" },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#31A24C",
    borderWidth: 2,
    borderColor: "#fff",
  },
  threadInfo: { flex: 1 },
  threadName: { fontSize: 15, fontWeight: "600", color: "#050505" },
  threadMessage: { fontSize: 14, color: "#65676B", marginTop: 2 },
  threadRight: { alignItems: "flex-end", gap: 6 },
  threadTime: { fontSize: 12, color: "#65676B" },
  unreadBadge: {
    backgroundColor: "#1877F2",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  unreadText: { fontSize: 12, fontWeight: "700", color: "#fff" },
});
