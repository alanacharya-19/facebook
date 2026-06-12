import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { NOTIFICATIONS, NOTIF_ICONS } from "../../data/notifications";
import ProfileSidebar from "../../components/ProfileSidebar";

const FILTERS = ["All", "Unread"];

function NotifIcon({ type, color }: { type: string; color: string }) {
  const icon = NOTIF_ICONS[type as keyof typeof NOTIF_ICONS] ?? "notifications";
  return (
    <View style={[styles.iconCircle, { backgroundColor: color }]}>
      <Ionicons name={icon} size={18} color="#fff" />
    </View>
  );
}

function MutualPhotos({ photos }: { photos: string[] }) {
  const count = photos.length === 1 ? 1 : 2;
  return (
    <View style={styles.mutualRow}>
      {photos.slice(0, count).map((url, i) => (
        <Image
          key={i}
          source={{ uri: url }}
          style={[styles.mutualPhoto, { marginLeft: i === 0 ? 0 : -8 }]}
        />
      ))}
      <Text style={styles.mutualText}>{photos.length === 1 ? "1 mutual friend" : `${photos.length} mutual friends`}</Text>
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
  const isFriendRequest = item.type === "friend_request" && item.message.includes("sent");

  if (isFriendRequest && "avatar" in item) {
    return (
      <View style={[styles.notifRow, item.unread && styles.unread]}>
        <Image source={{ uri: (item as typeof item & { avatar: string }).avatar }} style={styles.reqAvatar} />
        <View style={styles.notifContent}>
          <Text style={styles.notifText}>
            <Text style={styles.bold}>{item.user}</Text> {item.message}
          </Text>
          <View style={styles.reqMeta}>
            <Text style={styles.notifTime}>{item.time}</Text>
            {"mutualPhotos" in item && (
              <MutualPhotos photos={(item as typeof item & { mutualPhotos: string[] }).mutualPhotos} />
            )}
          </View>
          <View style={styles.reqActions}>
            <TouchableOpacity style={styles.confirmBtn} activeOpacity={0.7}>
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} activeOpacity={0.7}>
              <Text style={styles.deleteText}>Delete</Text>
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
      style={[styles.notifRow, item.unread && styles.unread]}
      activeOpacity={0.7}
    >
      <View style={styles.avatarWrap}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.notifAvatar} />
        ) : (
          <NotifIcon type={item.type} color={item.color} />
        )}
        <View style={[styles.indicator, { backgroundColor: item.color }]}>
          <Ionicons name={notifIcon} size={12} color="#fff" />
        </View>
      </View>
      <View style={styles.notifContent}>
        <Text style={styles.notifText}>
          <Text style={styles.bold}>{item.user}</Text> {item.message}
        </Text>
        <View style={styles.notifBottom}>
          {item.unread && <View style={styles.dot} />}
          <Text style={styles.notifTime}>{item.time}</Text>
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
  const [filter, setFilter] = useState(0);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const filtered =
    filter === 0 ? NOTIFICATIONS : NOTIFICATIONS.filter((n) => n.unread);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuBtn} activeOpacity={0.7} onPress={() => setSidebarVisible(true)}>
          <Ionicons name="menu-outline" size={24} color="#050505" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.searchBtn} activeOpacity={0.7} onPress={() => router.push("/search")}>
          <Ionicons name="search" size={22} color="#050505" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((f, i) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, i === filter && styles.activeFilter]}
            activeOpacity={0.7}
            onPress={() => setFilter(i)}
          >
            <Text
              style={[
                styles.filterText,
                i === filter && styles.activeFilterText,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <Text style={styles.emptyText}>No notifications</Text>
        ) : (
          <>
            <Text style={styles.sectionLabel}>Earlier</Text>
            {filtered.map((n) => (
              <NotifRow key={n.id} item={n} />
            ))}
          </>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
      <ProfileSidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 12,
    gap: 12,
  },
  menuBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E4E6EB",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#050505",
    flex: 1,
  },
  searchBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E4E6EB",
    alignItems: "center",
    justifyContent: "center",
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
    backgroundColor: "#E4E6EB",
  },
  activeFilter: {
    backgroundColor: "#1877F2",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#65676B",
  },
  activeFilterText: {
    color: "#fff",
  },
  scroll: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#65676B",
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
  unread: {
    backgroundColor: "#E7F3FF",
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
    color: "#050505",
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
    backgroundColor: "#1877F2",
  },
  notifTime: {
    fontSize: 12,
    color: "#65676B",
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
    borderColor: "#fff",
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
    borderColor: "#fff",
  },
  mutualText: {
    fontSize: 12,
    color: "#65676B",
    marginLeft: 3,
  },
  reqActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  confirmBtn: {
    backgroundColor: "#1877F2",
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 7,
  },
  confirmText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
  deleteBtn: {
    backgroundColor: "#E4E6EB",
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 7,
  },
  deleteText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#65676B",
  },
  emptyText: {
    fontSize: 14,
    color: "#65676B",
    textAlign: "center",
    marginTop: 40,
  },
});
