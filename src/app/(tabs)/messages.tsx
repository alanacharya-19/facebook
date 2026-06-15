import { Ionicons } from "@expo/vector-icons";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native";
import { router } from "expo-router";
import { MESSAGE_THREADS } from "../../data/messages";
import Avatar from "../../components/Avatar";

export default function MessagesScreen() {
  const onlineUsers = MESSAGE_THREADS.filter((t) => t.online);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
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

      {onlineUsers.length > 0 && (
        <View>
          <View style={styles.activeSection}>
            <Text style={styles.activeLabel}>Active</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.activeRow}>
              {onlineUsers.map((user) => (
                <TouchableOpacity key={user.id} style={styles.activeItem} activeOpacity={0.7}>
                  <View style={styles.activeAvatarWrap}>
                    <Avatar uri={user.avatar} size={60} style={styles.activeAvatar} />
                    <View style={styles.activeDot} />
                  </View>
                  <Text style={styles.activeName} numberOfLines={1}>{user.name.split(" ")[0]}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View style={styles.divider} />
          <Text style={styles.chatsLabel}>Chats</Text>
        </View>
      )}

      <FlatList
        data={MESSAGE_THREADS}
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ height: 20 }} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.thread} activeOpacity={0.7} onPress={() => router.push(`/messages/${item.id}` as any)}>
            <View style={styles.avatarWrap}>
              <Avatar uri={item.avatar} size={56} style={styles.avatar} />
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
  activeSection: { paddingTop: 12, paddingBottom: 8 },
  activeLabel: { fontSize: 16, fontWeight: "700", color: "#050505", paddingHorizontal: 16, marginBottom: 10 },
  activeRow: { paddingHorizontal: 12, gap: 8 },
  activeItem: { alignItems: "center", width: 68 },
  activeAvatarWrap: { position: "relative" },
  activeAvatar: { width: 60, height: 60, borderRadius: 30 },
  activeDot: {
    position: "absolute", bottom: 2, right: 2,
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: "#31A24C", borderWidth: 2, borderColor: "#fff",
  },
  activeName: { fontSize: 12, color: "#65676B", marginTop: 4, textAlign: "center" },
  divider: { height: 8, backgroundColor: "#F0F2F5" },
  separator: { height: 0.5, backgroundColor: "#CED0D4", marginLeft: 84 },
  chatsLabel: { fontSize: 16, fontWeight: "700", color: "#050505", paddingHorizontal: 16, paddingVertical: 10 },
});
