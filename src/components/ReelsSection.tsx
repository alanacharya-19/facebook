import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const REELS = Array.from({ length: 6 }, (_, i) => ({ id: String(i + 1), color: `hsl(${i * 60}, 70%, 60%)` }));

export default function ReelsSection() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="play" size={18} color="#1877F2" />
          <Text style={styles.title}>Reels</Text>
        </View>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {REELS.map((reel) => (
          <TouchableOpacity key={reel.id} style={styles.reel} activeOpacity={0.8}>
            <View style={[styles.reelThumb, { backgroundColor: reel.color }]}>
              <Ionicons name="play-circle" size={28} color="rgba(255,255,255,0.8)" />
            </View>
            <Text style={styles.reelLabel}>Reel {reel.id}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginTop: 8,
    paddingVertical: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
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
  scroll: {
    paddingHorizontal: 12,
    gap: 10,
  },
  reel: {
    width: 110,
  },
  reelThumb: {
    width: 110,
    height: 160,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  reelLabel: {
    fontSize: 12,
    color: "#333",
    marginTop: 4,
    textAlign: "center",
  },
});
