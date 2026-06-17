import { useRef, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ImageBackground, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { REELS_DATA } from "../../data/home";
import SearchOverlay from "../../components/SearchOverlay";
import Avatar from "../../components/Avatar";
import { useTheme } from "../../theme/ThemeContext";

function ReelItem({ item, height }: { item: typeof REELS_DATA[0]; height: number }) {
  const [liked, setLiked] = useState(false);
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View style={[styles.reelContainer, { height, width: "100%" }]}>
      <ImageBackground source={{ uri: item.image }} style={styles.reelBg} imageStyle={{ resizeMode: "cover" }}>
        <View style={styles.reelContent}>
          <View style={styles.centerPlay}>
            <View style={styles.playBtn}>
              <Ionicons name="play" size={36} color="rgba(255,255,255,0.9)" />
            </View>
          </View>

          <View style={[styles.bottomArea, { paddingBottom: insets.bottom + 10 }]}>
            <View style={styles.bottomLeft}>
              <TouchableOpacity style={styles.userRow} activeOpacity={0.7} onPress={() => router.push(`/profile/${item.user.toLowerCase()}` as any)}>
                <Avatar uri={item.avatar} size={32} style={styles.userAvatar} />
                <Text style={[styles.userName, { color: colors.white }]}>{item.user}</Text>
                <TouchableOpacity style={[styles.followBtn, { borderColor: colors.white }]} activeOpacity={0.7}>
                  <Text style={[styles.followText, { color: colors.white }]}>Follow</Text>
                </TouchableOpacity>
              </TouchableOpacity>
              <Text style={[styles.caption, { color: colors.white }]}>{item.caption}</Text>
              <View style={styles.musicRow}>
                <Ionicons name="musical-note" size={14} color={colors.white} />
                <Text style={[styles.musicText, { color: colors.white }]}>Original Audio</Text>
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7} onPress={() => setLiked(!liked)}>
                <Ionicons name={liked ? "heart" : "heart-outline"} size={30} color={liked ? colors.danger : colors.white} />
                <Text style={[styles.actionText, { color: colors.white }]}>{item.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                <Ionicons name="chatbubble-outline" size={28} color={colors.white} />
                <Text style={[styles.actionText, { color: colors.white }]}>{item.comments}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                <Ionicons name="bookmark-outline" size={26} color={colors.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                <Ionicons name="paper-plane-outline" size={26} color={colors.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                <Ionicons name="ellipsis-horizontal" size={26} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

export default function VideosScreen() {
  const { colors } = useTheme();
  const [viewHeight, setViewHeight] = useState(0);
  const [searching, setSearching] = useState(false);
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const insets = useSafeAreaInsets();
  const prevOffset = useRef(0);
  const headerVisible = useRef(true);

  const handleScroll = (e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    const dy = y - prevOffset.current;
    if (dy < 0 && !headerVisible.current) {
      headerVisible.current = true;
      Animated.timing(headerOpacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    } else if (dy > 0 && headerVisible.current) {
      headerVisible.current = false;
      Animated.timing(headerOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    }
    prevOffset.current = y;
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: colors.background }]} onLayout={(e) => setViewHeight(e.nativeEvent.layout.height)}>
        {viewHeight > 0 && (
          <FlatList
            data={REELS_DATA}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ReelItem item={item} height={viewHeight} />}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          />
        )}
      </View>

      <Animated.View style={[styles.header, { paddingTop: insets.top + 8, opacity: headerOpacity }]} pointerEvents={headerVisible.current ? "auto" : "none"}>
        <Text style={[styles.headerTitle, { color: colors.white, textShadowColor: colors.overlay }]}>Reels</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={[styles.headerBtn, { backgroundColor: colors.overlay }]} activeOpacity={0.7} onPress={() => setSearching(true)}>
            <Ionicons name="search" size={20} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerBtn, { backgroundColor: colors.overlay }]} activeOpacity={0.7}>
            <Ionicons name="add" size={22} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerBtn, { backgroundColor: colors.overlay }]} activeOpacity={0.7} onPress={() => router.push("/profile" as any)}>
            <Ionicons name="person-circle-outline" size={22} color={colors.white} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {searching && <SearchOverlay onClose={() => setSearching(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 10,
    zIndex: 10,
    elevation: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  headerRight: {
    flexDirection: "row",
    gap: 12,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  reelContainer: {
    overflow: "hidden",
  },
  reelBg: {
    flex: 1,
  },
  reelContent: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 0,
  },
  centerPlay: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
  },
  bottomLeft: {
    flex: 1,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  userName: {
    fontSize: 14,
    fontWeight: "700",
  },
  followBtn: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  followText: {
    fontSize: 11,
    fontWeight: "600",
  },
  caption: {
    fontSize: 14,
    marginTop: 8,
    lineHeight: 19,
  },
  musicRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  musicText: {
    fontSize: 12,
  },
  actions: {
    gap: 16,
    paddingBottom: 8,
    alignItems: "center",
  },
  actionBtn: {
    alignItems: "center",
    gap: 2,
  },
  actionText: {
    fontSize: 11,
    fontWeight: "600",
  },
});
