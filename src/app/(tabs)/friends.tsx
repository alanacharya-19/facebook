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

const TABS = ["Requests", "Suggestions", "All Friends"];

function RequestCard({ item }: { item: (typeof FRIEND_REQUESTS)[0] }) {
  return (
    <View style={styles.requestCard}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.reqInfo}>
        <Text style={styles.reqName}>{item.name}</Text>
        <Text style={styles.reqMutual}>{item.mutual} mutual friends</Text>
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

function SuggestionCard({ item }: { item: (typeof PEOPLE_YOU_MAY_KNOW)[0] }) {
  return (
    <View style={styles.suggestionCard}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <Text style={styles.suggName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.suggMutual}>{item.mutual} mutual</Text>
      <TouchableOpacity style={styles.addBtn} activeOpacity={0.7}>
        <Ionicons name="person-add" size={16} color="#fff" />
        <Text style={styles.addBtnText}>Add Friend</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function FriendsScreen() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
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
        {activeTab === 0 && (
          <View style={styles.section}>
            {FRIEND_REQUESTS.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Friend Requests</Text>
                {FRIEND_REQUESTS.map((req) => (
                  <RequestCard key={req.id} item={req} />
                ))}
              </>
            )}
            <Text style={styles.sectionTitle}>People You May Know</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggScroll}
            >
              {PEOPLE_YOU_MAY_KNOW.map((p) => (
                <SuggestionCard key={p.id} item={p} />
              ))}
            </ScrollView>
          </View>
        )}

        {activeTab === 1 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>People You May Know</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggScroll}
            >
              {PEOPLE_YOU_MAY_KNOW.map((p) => (
                <SuggestionCard key={p.id} item={p} />
              ))}
            </ScrollView>
          </View>
        )}

        {activeTab === 2 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>All Friends</Text>
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
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#050505",
    marginBottom: 12,
  },
  requestCard: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  reqInfo: {
    flex: 1,
    justifyContent: "center",
  },
  reqName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#050505",
  },
  reqMutual: {
    fontSize: 13,
    color: "#65676B",
    marginTop: 1,
    marginBottom: 8,
  },
  reqActions: {
    flexDirection: "row",
    gap: 8,
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
  suggScroll: {
    gap: 10,
    paddingBottom: 8,
  },
  suggestionCard: {
    width: 130,
    borderWidth: 0.5,
    borderColor: "#CED0D4",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  suggName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#050505",
    marginTop: 8,
    textAlign: "center",
    width: "100%",
  },
  suggMutual: {
    fontSize: 12,
    color: "#65676B",
    marginTop: 2,
    marginBottom: 10,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "#1877F2",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    width: "100%",
  },
  addBtnText: {
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
