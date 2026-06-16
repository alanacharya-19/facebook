import { Ionicons } from "@expo/vector-icons";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native";
import { router } from "expo-router";
import { MESSAGE_THREADS } from "../../data/messages";
import Avatar from "../../components/Avatar";
import { useTheme } from "../../theme/ThemeContext";

export default function MessagesScreen() {
  const { colors } = useTheme();
  const onlineUsers = MESSAGE_THREADS.filter((t) => t.online);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Messages</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={[styles.headerBtn, { backgroundColor: colors.borderLight }]} activeOpacity={0.7}>
            <Ionicons name="search" size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerBtn, { backgroundColor: colors.borderLight }]} activeOpacity={0.7}>
            <Ionicons name="settings-outline" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {onlineUsers.length > 0 && (
        <View>
          <View style={styles.activeSection}>
            <Text style={[styles.activeLabel, { color: colors.text }]}>Active</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.activeRow}>
              {onlineUsers.map((user) => (
                  <TouchableOpacity key={user.id} style={styles.activeItem} activeOpacity={0.7}>
                    <View style={styles.activeAvatarWrap}>
                      <Avatar uri={user.avatar} size={60} style={styles.activeAvatar} />
                      <View style={[styles.activeDot, { backgroundColor: colors.success, borderColor: colors.white }]} />
                    </View>
                  <Text style={[styles.activeName, { color: colors.textSecondary }]} numberOfLines={1}>{user.name.split(" ")[0]}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.cardSecondary }]} />
          <Text style={[styles.chatsLabel, { color: colors.text }]}>Chats</Text>
        </View>
      )}

      <FlatList
        data={MESSAGE_THREADS}
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ height: 20 }} />}
        ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.border }]} />}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.thread} activeOpacity={0.7} onPress={() => router.push(`/messages/${item.id}` as any)}>
            <View style={styles.avatarWrap}>
              <Avatar uri={item.avatar} size={56} style={styles.avatar} />
              {item.online && <View style={[styles.onlineDot, { backgroundColor: colors.success, borderColor: colors.white }]} />}
            </View>
            <View style={styles.threadInfo}>
              <Text style={[styles.threadName, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.threadMessage, { color: colors.textSecondary }]} numberOfLines={1}>{item.lastMessage}</Text>
            </View>
            <View style={styles.threadRight}>
              <Text style={[styles.threadTime, { color: colors.textSecondary }]}>{item.time}</Text>
              {item.unread > 0 && (
                <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.unreadText, { color: colors.white }]}>{item.unread}</Text>
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
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
  },
  headerTitle: { fontSize: 24, fontWeight: "700" },
  headerRight: { flexDirection: "row", gap: 8 },
  headerBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
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
    borderWidth: 2,
  },
  threadInfo: { flex: 1 },
  threadName: { fontSize: 15, fontWeight: "600" },
  threadMessage: { fontSize: 14, marginTop: 2 },
  threadRight: { alignItems: "flex-end", gap: 6 },
  threadTime: { fontSize: 12 },
  unreadBadge: {
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  unreadText: { fontSize: 12, fontWeight: "700" },
  activeSection: { paddingTop: 12, paddingBottom: 8 },
  activeLabel: { fontSize: 16, fontWeight: "700", paddingHorizontal: 16, marginBottom: 10 },
  activeRow: { paddingHorizontal: 12, gap: 8 },
  activeItem: { alignItems: "center", width: 68 },
  activeAvatarWrap: { position: "relative" },
  activeAvatar: { width: 60, height: 60, borderRadius: 30 },
  activeDot: {
    position: "absolute", bottom: 2, right: 2,
    width: 14, height: 14, borderRadius: 7,
    borderWidth: 2,
  },
  activeName: { fontSize: 12, marginTop: 4, textAlign: "center" },
  divider: { height: 8 },
  separator: { height: 0.5, marginLeft: 84 },
  chatsLabel: { fontSize: 16, fontWeight: "700", paddingHorizontal: 16, paddingVertical: 10 },
});
