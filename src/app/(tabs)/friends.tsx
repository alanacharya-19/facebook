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
import { FRIEND_REQUESTS, PEOPLE_YOU_MAY_KNOW } from "../../data/friends";
import ProfileSidebar from "../../components/ProfileSidebar";

const TABS = ["Suggestions", "Your Friends"];

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

function PersonCard({
  item,
  type,
}: {
  item: { id: string; name: string; avatar: string; mutual: number; time: string; mutualPhotos: string[] };
  type: "request" | "suggestion";
}) {
  const isSuggestion = type === "suggestion";
  return (
    <View style={styles.personCard}>
      <Image source={{ uri: item.avatar }} style={[styles.personAvatar, isSuggestion && styles.personAvatarSm]} />
      <View style={styles.personInfo}>
        <Text style={styles.personName}>{item.name}</Text>
        <View style={styles.personMeta}>
          <MutualPhotos photos={item.mutualPhotos} />
          {!isSuggestion && <Text style={styles.personTime}>{item.time}</Text>}
        </View>
        {type === "request" && (
          <View style={styles.personActions}>
            <TouchableOpacity style={styles.confirmBtn} activeOpacity={0.7}>
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} activeOpacity={0.7}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {isSuggestion && (
        <TouchableOpacity style={styles.addFriendBtn} activeOpacity={0.7}>
          <Ionicons name="person-add" size={14} color="#fff" />
          <Text style={styles.addFriendText}>Add Friend</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function FriendsScreen() {
  const [activeTab, setActiveTab] = useState(0);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <View style={styles.container}>
      <ProfileSidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuBtn} activeOpacity={0.7} onPress={() => setSidebarVisible(true)}>
          <Ionicons name="menu-outline" size={24} color="#050505" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Friends</Text>
        <TouchableOpacity style={styles.searchBtn} activeOpacity={0.7}>
          <Ionicons name="search" size={22} color="#050505" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabRow}>
        {TABS.map((tab, i) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, i === activeTab && styles.activeTab]}
            activeOpacity={0.7}
            onPress={() => setActiveTab(i)}
          >
            <Text
              style={[styles.tabText, i === activeTab && styles.activeTabText]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {FRIEND_REQUESTS.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Friend Requests{" "}
                <Text style={styles.reqCount}>({FRIEND_REQUESTS.length})</Text>
              </Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            {FRIEND_REQUESTS.map((req) => (
              <PersonCard key={req.id} item={req} type="request" />
            ))}
          </View>
        )}

        {activeTab === 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Suggestions</Text>
            {PEOPLE_YOU_MAY_KNOW.map((p) => (
              <PersonCard key={p.id} item={p} type="suggestion" />
            ))}
          </View>
        )}

        {activeTab === 1 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Friends</Text>
            <Text style={styles.emptyText}>Your friends will appear here.</Text>
          </View>
        )}

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
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#E4E6EB",
  },
  activeTab: {
    backgroundColor: "#1877F2",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#65676B",
  },
  activeTabText: {
    color: "#fff",
  },
  scroll: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#050505",
    marginBottom: 14,
  },
  reqCount: {
    fontSize: 15,
    fontWeight: "500",
    color: "#F02849",
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1877F2",
  },
  personCard: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  personAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  personAvatarSm: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  personInfo: {
    flex: 1,
    gap: 2,
  },
  personName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#050505",
  },
  personMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  mutualRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  mutualPhoto: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },
  mutualText: {
    fontSize: 13,
    color: "#65676B",
    marginLeft: 4,
  },
  personTime: {
    fontSize: 12,
    color: "#65676B",
  },
  personActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  confirmBtn: {
    backgroundColor: "#1877F2",
    borderRadius: 6,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  confirmText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  deleteBtn: {
    backgroundColor: "#E4E6EB",
    borderRadius: 6,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#65676B",
  },
  addFriendBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "#1877F2",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  addFriendText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  emptyText: {
    fontSize: 14,
    color: "#65676B",
    textAlign: "center",
    marginTop: 20,
  },
});
