import { Ionicons } from "@expo/vector-icons";
import { useState, useMemo } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { NOTIFICATIONS, NOTIF_ICONS } from "../../data/notifications";
import Avatar from "../../components/Avatar";
import { useTheme } from "../../theme/ThemeContext";

const FILTERS = ["All", "Unread"];

function NotifIcon({ type, color }: { type: string; color: string }) {
  const { colors } = useTheme();
  const icon = NOTIF_ICONS[type as keyof typeof NOTIF_ICONS] ?? "notifications";
  return (
    <View style={[styles.iconCircle, { backgroundColor: color }]}>
      <Ionicons name={icon} size={18} color={colors.white} />
    </View>
  );
}

function MutualPhotos({ photos }: { photos: string[] }) {
  const { colors } = useTheme();
  const count = photos.length === 1 ? 1 : 2;
  return (
    <View style={styles.mutualRow}>
      {photos.slice(0, count).map((url, i) => (
        <Image
          key={i}
          source={{ uri: url }}
          style={[styles.mutualPhoto, { marginLeft: i === 0 ? 0 : -8, borderColor: colors.white }]}
        />
      ))}
      <Text style={[styles.mutualText, { color: colors.textSecondary }]}>{photos.length === 1 ? "1 mutual friend" : `${photos.length} mutual friends`}</Text>
    </View>
  );
}

const AVATAR_URLS: Record<string, string> = {
  Alice: "https://i.pravatar.cc/150?u=alice",
  Bob: "https://i.pravatar.cc/150?u=bob",
  Charlie: "https://i.pravatar.cc/150?u=charlie",
  Diana: "https://i.pravatar.cc/150?u=diana",
  Eve: "https://i.pravatar.cc/150?u=eve",
  Frank: "https://i.pravatar.cc/150?u=frank",
  Grace: "https://i.pravatar.cc/150?u=grace2",
  Henry: "https://i.pravatar.cc/150?u=henry",
  Ivy: "https://i.pravatar.cc/150?u=ivy",
};

function NotifRow({ item }: { item: typeof NOTIFICATIONS[0] }) {
  const { colors } = useTheme();
  const isFriendRequest = item.type === "friend_request" && item.message.includes("sent");

  if (isFriendRequest && "avatar" in item) {
    return (
      <View style={[styles.notifRow, item.unread && { backgroundColor: colors.primaryLight }]}>
        <Avatar uri={(item as typeof item & { avatar: string }).avatar} size={52} style={styles.reqAvatar} />
        <View style={styles.notifContent}>
          <Text style={[styles.notifText, { color: colors.text }]}>
            <Text style={styles.bold}>{item.user}</Text> {item.message}
          </Text>
          <View style={styles.reqMeta}>
            <Text style={[styles.notifTime, { color: colors.textSecondary }]}>{item.time}</Text>
            {"mutualPhotos" in item && (
              <MutualPhotos photos={(item as typeof item & { mutualPhotos: string[] }).mutualPhotos} />
            )}
          </View>
          <View style={styles.reqActions}>
            <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: colors.primary }]} activeOpacity={0.7}>
              <Text style={[styles.confirmText, { color: colors.white }]}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.deleteBtn, { backgroundColor: colors.borderLight }]} activeOpacity={0.7}>
              <Text style={[styles.deleteText, { color: colors.textSecondary }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  const avatarUrl = AVATAR_URLS[item.user];
  const notifIcon = NOTIF_ICONS[item.type as keyof typeof NOTIF_ICONS] ?? "notifications";
  const hasPreview = "preview" in item && item.type !== "friend_request" && item.type !== "birthday" && item.type !== "group";

  return (
    <TouchableOpacity
      style={[styles.notifRow, item.unread && { backgroundColor: colors.primaryLight }]}
      activeOpacity={0.7}
    >
      <View style={styles.avatarWrap}>
        {avatarUrl ? (
          <Avatar uri={avatarUrl} size={52} style={styles.notifAvatar} />
        ) : (
          <NotifIcon type={item.type} color={item.color} />
        )}
        <View style={[styles.indicator, { backgroundColor: item.color, borderColor: colors.white }]}>
          <Ionicons name={notifIcon} size={12} color={colors.white} />
        </View>
      </View>
      <View style={styles.notifContent}>
        <Text style={[styles.notifText, { color: colors.text }]}>
          <Text style={styles.bold}>{item.user}</Text> {item.message}
        </Text>
        <View style={styles.notifBottom}>
          {item.unread && <View style={[styles.dot, { backgroundColor: colors.primary }]} />}
          <Text style={[styles.notifTime, { color: colors.textSecondary }]}>{item.time}</Text>
        </View>
      </View>
      {hasPreview && (
        <Image
          source={{ uri: (item as typeof item & { preview: string }).preview }}
          style={styles.previewImg}
        />
      )}
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const [filter, setFilter] = useState(0);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let items = filter === 0 ? NOTIFICATIONS : NOTIFICATIONS.filter((n) => n.unread);
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (n) =>
        n.user.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q)
    );
  }, [filter, searchQuery]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        {searching ? (
          <View style={[styles.inlineSearch, { backgroundColor: colors.inputBg }]}>
            <Ionicons name="search" size={18} color={colors.textSecondary} />
            <TextInput
              placeholder="Search notifications..."
              placeholderTextColor={colors.textTertiary}
              style={[styles.inlineSearchInput, { color: colors.text }]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            <TouchableOpacity activeOpacity={0.7} onPress={() => { setSearching(false); setSearchQuery(""); }}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
            <TouchableOpacity style={[styles.searchBtn, { backgroundColor: colors.borderLight }]} activeOpacity={0.7} onPress={() => setSearching(true)}>
              <Ionicons name="search" size={22} color={colors.text} />
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((f, i) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, { backgroundColor: colors.borderLight }, i === filter && { backgroundColor: colors.primary }]}
            activeOpacity={0.7}
            onPress={() => setFilter(i)}
          >
            <Text
              style={[
                styles.filterText,
                { color: colors.textSecondary },
                i === filter && { color: colors.white },
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No notifications</Text>
        ) : (
          <>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Earlier</Text>
            {filtered.map((n) => (
              <NotifRow key={n.id} item={n} />
            ))}
          </>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 12,
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    flex: 1,
  },
  searchBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  inlineSearch: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 36,
    gap: 8,
  },
  inlineSearchInput: {
    flex: 1,
    fontSize: 15,
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
  },
  scroll: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: "700",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  notifRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  notifContent: {
    flex: 1,
  },
  notifText: {
    fontSize: 14,
    lineHeight: 19,
  },
  bold: {
    fontWeight: "600",
  },
  notifBottom: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 3,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  notifTime: {
    fontSize: 12,
  },
  avatarWrap: {
    position: "relative",
  },
  notifAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  indicator: {
    position: "absolute",
    bottom: -2,
    right: -4,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  previewImg: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  reqAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  reqMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  mutualRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  mutualPhoto: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
  },
  mutualText: {
    fontSize: 12,
    marginLeft: 3,
  },
  reqActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  confirmBtn: {
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 7,
  },
  confirmText: {
    fontSize: 13,
    fontWeight: "600",
  },
  deleteBtn: {
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 7,
  },
  deleteText: {
    fontSize: 13,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 40,
  },
});
