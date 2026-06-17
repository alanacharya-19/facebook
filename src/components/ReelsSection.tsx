import { useRef, useState } from "react";
import { Animated, ScrollView, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeContext";
import { REELS_COUNT } from "../data/home";
import ShareModal from "./ShareModal";

const SAMPLE_VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
];

const DEFAULT_REELS = Array.from({ length: REELS_COUNT }, (_, i) => ({
  id: String(i + 1),
  video: SAMPLE_VIDEOS[i % SAMPLE_VIDEOS.length],
}));

type Props = {
  data?: typeof DEFAULT_REELS;
};

function ReelCard({ reel, colors, onComment, onShare, onMenuOpen }: {
  reel: typeof DEFAULT_REELS[0];
  colors: ReturnType<typeof useTheme>["colors"];
  onComment: () => void;
  onShare: () => void;
  onMenuOpen: () => void;
}) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [playing, setPlaying] = useState(true);
  const heartScale = useRef(new Animated.Value(1)).current;
  const player = useVideoPlayer(reel.video, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  const pulse = () => {
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1.4, useNativeDriver: true, friction: 3 }),
      Animated.spring(heartScale, { toValue: 1, useNativeDriver: true, friction: 3 }),
    ]).start();
  };

  const togglePlay = () => {
    if (playing) {
      player.pause();
    } else {
      player.play();
    }
    setPlaying(!playing);
  };

  return (
    <View style={[styles.reel, { borderRadius: 12, overflow: "hidden" }]}>
      <VideoView
        player={player}
        style={styles.thumbBg}
        contentFit="cover"
        nativeControls={false}
      />
      <TouchableOpacity style={styles.playOverlay} activeOpacity={1} onPress={togglePlay}>
        {!playing && (
          <View style={styles.playBtn}>
            <Ionicons name="play" size={22} color="#fff" />
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.actionsCol}>
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7} onPress={() => { if (!liked) pulse(); setLiked(!liked); }}>
          <Animated.View style={{ transform: [{ scale: heartScale }] }}>
            <Ionicons name={liked ? "heart" : "heart-outline"} size={18} color={liked ? "#F02849" : "#fff"} />
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7} onPress={onComment}>
          <Ionicons name="chatbubble-outline" size={16} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7} onPress={() => setSaved(!saved)}>
          <Ionicons name={saved ? "bookmark" : "bookmark-outline"} size={16} color={saved ? "#1877F2" : "#fff"} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7} onPress={onShare}>
          <Ionicons name="arrow-redo-outline" size={16} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7} onPress={onMenuOpen}>
          <Ionicons name="ellipsis-vertical" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ReelsSection({ data }: Props) {
  const { colors, isDark } = useTheme();
  const reels = data ?? DEFAULT_REELS;
  const [shareVisible, setShareVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const [menuTarget, setMenuTarget] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(1500),
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  };

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
          <ReelCard
            key={reel.id}
            reel={reel}
            colors={colors}
            onComment={() => showToast("Comments coming soon")}
            onShare={() => setShareVisible(true)}
            onMenuOpen={() => setMenuTarget(menuTarget === reel.id ? null : reel.id)}
          />
        ))}
      </ScrollView>

      {menuTarget && (
        <View style={[styles.reelMenuDropdown, { backgroundColor: colors.card, borderColor: colors.border, top: 220, right: 12 }]}>
          {["Hide reel", "Report", "Not interested"].map((item) => (
            <TouchableOpacity key={item} style={[styles.reelMenuItem, { borderBottomColor: colors.borderLight }]} activeOpacity={0.7} onPress={() => setMenuTarget(null)}>
              <Text style={[styles.reelMenuItemText, { color: colors.text }]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Animated.View pointerEvents="none" style={[styles.toast, { opacity: toastOpacity, backgroundColor: isDark ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.7)" }]}>
        <Text style={styles.toastText}>{toastMsg}</Text>
      </Animated.View>

      <ShareModal visible={shareVisible} onClose={() => setShareVisible(false)} />
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
    height: 200,
  },
  thumbBg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  playOverlay: {
    ...StyleSheet.absoluteFill,
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
  actionsCol: {
    position: "absolute",
    bottom: 8,
    right: 4,
    alignItems: "center",
    gap: 4,
  },
  actionBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  toast: {
    position: "absolute",
    bottom: 60,
    left: 20,
    right: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    alignItems: "center",
    zIndex: 200,
  },
  toastText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
  reelMenuDropdown: {
    position: "absolute",
    top: 100,
    right: 12,
    zIndex: 300,
    borderRadius: 10,
    minWidth: 160,
    borderWidth: 0.5,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  reelMenuItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  reelMenuItemText: {
    fontSize: 13,
  },
});
