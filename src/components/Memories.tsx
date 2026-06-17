import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Memories() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="time-outline" size={20} color="#1877F2" />
          <Text style={styles.title}>Memories</Text>
        </View>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.card} activeOpacity={0.8}>
        <View style={styles.imageSide}>
          <View style={styles.memoryImage}>
            <Ionicons name="image-outline" size={32} color="#BCC0C4" />
          </View>
        </View>
        <View style={styles.contentSide}>
          <Text style={styles.memoryLabel}>On this day</Text>
          <Text style={styles.memoryText} numberOfLines={2}>
            Look back at a post you shared 2 years ago
          </Text>
          <TouchableOpacity style={styles.shareBtn} activeOpacity={0.7}>
            <Text style={styles.shareText}>Share</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 6,
    borderBottomColor: "#F0F2F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#050505",
  },
  seeAll: {
    fontSize: 14,
    color: "#1877F2",
    fontWeight: "500",
  },
  card: {
    flexDirection: "row",
    borderWidth: 0.5,
    borderColor: "#CED0D4",
    borderRadius: 10,
    overflow: "hidden",
  },
  imageSide: {
    width: 100,
    height: 100,
  },
  memoryImage: {
    flex: 1,
    backgroundColor: "#F0F2F5",
    alignItems: "center",
    justifyContent: "center",
  },
  contentSide: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  memoryLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1877F2",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  memoryText: {
    fontSize: 14,
    color: "#65676B",
    marginTop: 4,
    lineHeight: 19,
  },
  shareBtn: {
    marginTop: 10,
    backgroundColor: "#E7F3FF",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
  },
  shareText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1877F2",
  },
});
