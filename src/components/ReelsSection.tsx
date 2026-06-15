import { ScrollView, View, Text, ImageBackground, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { REELS_COUNT } from "../data/home";

const DEFAULT_REELS = Array.from({ length: REELS_COUNT }, (_, i) => ({
  id: String(i + 1),
  image: `https://picsum.photos/seed/reel${i + 1}/232/392`,
}));

type Props = {
  data?: typeof DEFAULT_REELS;
};

export default function ReelsSection({ data }: Props) {
  const reels = data ?? DEFAULT_REELS;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="play" size={20} color="#1877F2" />
          <Text style={styles.title}>Reels</Text>
        </View>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {reels.map((reel) => (
          <TouchableOpacity key={reel.id} style={styles.reel} activeOpacity={0.9}>
            <ImageBackground source={{ uri: reel.image }} style={styles.thumb} imageStyle={{ borderRadius: 12 }}>
              <View style={styles.playOverlay}>
                <View style={styles.playBtn}>
                  <Ionicons name="play" size={22} color="#fff" />
                </View>
              </View>
              <View style={styles.reelFooter}>
                <View style={styles.reelAvatar}>
                  <Ionicons name="person" size={14} color="#fff" />
                </View>
                <Text style={styles.reelName}>User {reel.id}</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginTop: 0,
    paddingVertical: 14,
    borderBottomWidth: 6,
    borderBottomColor: "#F0F2F5",
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
    fontSize: 17,
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
    gap: 8,
  },
  reel: {
    width: 116,
  },
  thumb: {
    width: 116,
    height: 196,
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  playOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  reelFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 10,
  },
  reelAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  reelName: {
    fontSize: 11,
    fontWeight: "600",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
