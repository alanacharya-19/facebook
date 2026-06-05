import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NOTIFICATIONS, NOTIF_ICONS } from "../../data/notifications";

const FILTERS = ["All", "Unread"];

function NotifIcon({ type, color }: { type: string; color: string }) {
  const icon = NOTIF_ICONS[type as keyof typeof NOTIF_ICONS] ?? "notifications";
  return (
    <View style={[styles.iconCircle, { backgroundColor: color }]}>
      <Ionicons name={icon} size={18} color="#fff" />
    </View>
  );
}

export default function NotificationsScreen() {
  const [filter, setFilter] = useState(0);

  const filtered =
    filter === 0 ? NOTIFICATIONS : NOTIFICATIONS.filter((n) => n.unread);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.menuBtn} activeOpacity={0.7}>
          <Ionicons name="ellipsis-horizontal" size={22} color="#050505" />
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
        <Text style={styles.sectionLabel}>New</Text>
        {filtered
          .filter((n) => n.unread)
          .map((n) => (
            <TouchableOpacity
              key={n.id}
              style={[styles.notifRow, n.unread && styles.unread]}
              activeOpacity={0.7}
            >
              <NotifIcon type={n.type} color={n.color} />
              <View style={styles.notifContent}>
                <Text style={styles.notifText}>
                  <Text style={styles.bold}>{n.user}</Text> {n.message}
                </Text>
                <View style={styles.notifBottom}>
                  {n.unread && <View style={styles.dot} />}
                  <Text style={styles.notifTime}>{n.time}</Text>
                </View>
              </View>
              {n.type === "friend_request" && n.message.includes("sent") && (
                <TouchableOpacity style={styles.followBack} activeOpacity={0.7}>
                  <Text style={styles.followBackText}>Confirm</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))}

        {filtered.filter((n) => !n.unread).length > 0 && (
          <Text style={styles.sectionLabel}>Earlier</Text>
        )}
        {filtered
          .filter((n) => !n.unread)
          .map((n) => (
            <TouchableOpacity
              key={n.id}
              style={styles.notifRow}
              activeOpacity={0.7}
            >
              <NotifIcon type={n.type} color={n.color} />
              <View style={styles.notifContent}>
                <Text style={styles.notifText}>
                  <Text style={styles.bold}>{n.user}</Text> {n.message}
                </Text>
                <Text style={styles.notifTime}>{n.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        <View style={{ height: 40 }} />
      </ScrollView>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#050505",
  },
  menuBtn: {
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
    alignItems: "center",
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
  followBack: {
    backgroundColor: "#1877F2",
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  followBackText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
});
