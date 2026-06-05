import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ROOM_FRIENDS_COLORS, GROUPS } from "../data/home";

export default function RoomsGroups() {
  return (
    <View style={styles.container}>
      <View style={styles.rooms}>
        <Text style={styles.title}>Rooms</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.roomScroll}>
          <TouchableOpacity style={styles.createRoom} activeOpacity={0.7}>
            <View style={styles.createIcon}>
              <Ionicons name="videocam" size={22} color="#8B5CF6" />
            </View>
            <Text style={styles.createText}>Create{'\n'}Room</Text>
          </TouchableOpacity>
          {ROOM_FRIENDS_COLORS.map((color, i) => (
            <View key={i} style={styles.roomFriend}>
              <View style={[styles.roomAvatar, { backgroundColor: color }]}>
                <Ionicons name="person" size={20} color="#fff" />
              </View>
              <View style={styles.onlineDot} />
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.divider} />

      <View style={styles.groups}>
        <View style={styles.groupsHeader}>
          <Text style={styles.title}>Your Groups</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {GROUPS.map((g, i) => (
          <TouchableOpacity key={i} style={styles.groupRow} activeOpacity={0.7}>
            <View style={styles.groupIcon}>
              <Ionicons name="people" size={20} color="#fff" />
            </View>
            <View style={styles.groupInfo}>
              <Text style={styles.groupName}>{g.name}</Text>
              <Text style={styles.groupMeta}>{g.members}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 6,
    borderBottomColor: "#F0F2F5",
  },
  rooms: {
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#050505",
    marginBottom: 10,
  },
  roomScroll: {
    gap: 12,
    paddingBottom: 4,
  },
  createRoom: {
    alignItems: "center",
    width: 68,
  },
  createIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: "#8B5CF6",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  createText: {
    fontSize: 11,
    color: "#8B5CF6",
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 14,
  },
  roomFriend: {
    alignItems: "center",
    width: 52,
    marginTop: -2,
  },
  roomAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2.5,
    borderColor: "#E4E6EB",
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#45BD62",
    borderWidth: 2,
    borderColor: "#fff",
    position: "absolute",
    bottom: 16,
    right: 0,
  },
  divider: {
    height: 0.5,
    backgroundColor: "#CED0D4",
    marginVertical: 12,
  },
  groups: {},
  groupsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  seeAll: {
    fontSize: 14,
    color: "#1877F2",
    fontWeight: "500",
  },
  groupRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  groupIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1877F2",
    alignItems: "center",
    justifyContent: "center",
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#050505",
  },
  groupMeta: {
    fontSize: 12,
    color: "#65676B",
    marginTop: 1,
  },
});
