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
import { FRIEND_REQUESTS, PEOPLE_YOU_MAY_KNOW, ALL_FRIENDS } from "../../data/friends";
import Avatar from "../../components/Avatar";
import { useTheme } from "../../theme/ThemeContext";

const TABS = ["Suggestions", "Your Friends"];

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

function PersonCard({
  item,
  type,
}: {
  item: { id: string; name: string; avatar: string; mutual: number; time: string; mutualPhotos: string[] };
  type: "request" | "suggestion";
}) {
  const { colors } = useTheme();
  const isSuggestion = type === "suggestion";
  return (
    <View style={styles.personCard}>
      <Avatar uri={item.avatar} size={72} style={[styles.personAvatar, isSuggestion && styles.personAvatarSm]} />
      <View style={styles.personInfo}>
        <Text style={[styles.personName, { color: colors.text }]}>{item.name}</Text>
        <View style={styles.personMeta}>
          <MutualPhotos photos={item.mutualPhotos} />
          {!isSuggestion && <Text style={[styles.personTime, { color: colors.textSecondary }]}>{item.time}</Text>}
        </View>
        {type === "request" && (
          <View style={styles.personActions}>
            <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: colors.primary }]} activeOpacity={0.7}>
              <Text style={[styles.confirmText, { color: colors.white }]}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.deleteBtn, { backgroundColor: colors.borderLight }]} activeOpacity={0.7}>
              <Text style={[styles.deleteText, { color: colors.textSecondary }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {isSuggestion && (
        <TouchableOpacity style={[styles.addFriendBtn, { backgroundColor: colors.primary }]} activeOpacity={0.7}>
          <Ionicons name="person-add" size={14} color={colors.white} />
          <Text style={[styles.addFriendText, { color: colors.white }]}>Add Friend</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function FriendsScreen() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRequests = useMemo(() => {
    if (!searchQuery.trim()) return FRIEND_REQUESTS;
    const q = searchQuery.toLowerCase();
    return FRIEND_REQUESTS.filter((p) => p.name.toLowerCase().includes(q));
  }, [searchQuery]);

  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return PEOPLE_YOU_MAY_KNOW;
    const q = searchQuery.toLowerCase();
    return PEOPLE_YOU_MAY_KNOW.filter((p) => p.name.toLowerCase().includes(q));
  }, [searchQuery]);

  const filteredFriends = useMemo(() => {
    if (!searchQuery.trim()) return ALL_FRIENDS;
    const q = searchQuery.toLowerCase();
    return ALL_FRIENDS.filter((f) => f.name.toLowerCase().includes(q));
  }, [searchQuery]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        {searching ? (
          <View style={[styles.inlineSearch, { backgroundColor: colors.inputBg }]}>
            <Ionicons name="search" size={18} color={colors.textSecondary} />
            <TextInput
              placeholder="Search friends..."
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
            <Text style={[styles.headerTitle, { color: colors.text }]}>Friends</Text>
            <TouchableOpacity style={[styles.searchBtn, { backgroundColor: colors.borderLight }]} activeOpacity={0.7} onPress={() => setSearching(true)}>
              <Ionicons name="search" size={22} color={colors.text} />
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.tabRow}>
        {TABS.map((tab, i) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, { backgroundColor: colors.borderLight }, i === activeTab && { backgroundColor: colors.primary }]}
            activeOpacity={0.7}
            onPress={() => setActiveTab(i)}
          >
            <Text
              style={[styles.tabText, { color: colors.textSecondary }, i === activeTab && { color: colors.white }]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {searching ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>People</Text>
            {filteredRequests.length === 0 && filteredSuggestions.length === 0 && filteredFriends.length === 0 ? (
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No results found</Text>
            ) : (
              <>
                {filteredRequests.map((req) => (
                  <PersonCard key={req.id} item={req} type="request" />
                ))}
                {filteredSuggestions.map((p) => (
                  <PersonCard key={p.id} item={p} type="suggestion" />
                ))}
              </>
            )}
          </View>
        ) : (
          <>
            {FRIEND_REQUESTS.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Friend Requests{" "}
                    <Text style={[styles.reqCount, { color: colors.danger }]}>({FRIEND_REQUESTS.length})</Text>
                  </Text>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
                  </TouchableOpacity>
                </View>
                {FRIEND_REQUESTS.map((req) => (
                  <PersonCard key={req.id} item={req} type="request" />
                ))}
              </View>
            )}

            {activeTab === 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Suggestions</Text>
                {PEOPLE_YOU_MAY_KNOW.map((p) => (
                  <PersonCard key={p.id} item={p} type="suggestion" />
                ))}
              </View>
            )}

            {activeTab === 1 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Friends</Text>
                {ALL_FRIENDS.length === 0 ? (
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Your friends will appear here.</Text>
                ) : (
                  ALL_FRIENDS.map((f) => (
                    <View key={f.id} style={styles.personCard}>
                      <Avatar uri={f.avatar} size={56} style={[styles.personAvatar, styles.personAvatarSm]} />
                      <View style={styles.personInfo}>
                        <Text style={[styles.personName, { color: colors.text }]}>{f.name}</Text>
                      </View>
                    </View>
                  ))
                )}
              </View>
            )}
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
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
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
    marginBottom: 14,
  },
  reqCount: {
    fontSize: 15,
    fontWeight: "500",
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "600",
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
  },
  mutualText: {
    fontSize: 13,
    marginLeft: 4,
  },
  personTime: {
    fontSize: 12,
  },
  personActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  confirmBtn: {
    borderRadius: 6,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  confirmText: {
    fontSize: 14,
    fontWeight: "600",
  },
  deleteBtn: {
    borderRadius: 6,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: "600",
  },
  addFriendBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  addFriendText: {
    fontSize: 12,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
  },
});
