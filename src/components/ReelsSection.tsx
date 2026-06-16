import { ScrollView, View, Text, ImageBackground, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeContext";
import { REELS_COUNT } from "../data/home";

const DEFAULT_REELS = Array.from({ length: REELS_COUNT }, (_, i) => ({
  id: String(i + 1),
  image: `https://picsum.photos/seed/reel${i + 1}/232/392`,
}));

type Props = {
  data?: typeof DEFAULT_REELS;
};

export default function ReelsSection({ data }: Props) {
  const { colors } = useTheme();
  const reels = data ?? DEFAULT_REELS;
  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderBottomColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="play" size={20} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>Reels</Text>
        </View>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
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
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    paddingVertical: 14,
    borderBottomWidth: 6,
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
  },
  seeAll: {
    fontSize: 14,
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
});
