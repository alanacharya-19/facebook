import { useRef, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ImageBackground, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { REELS_DATA } from "../../data/home";
import SearchOverlay from "../../components/SearchOverlay";

function ReelItem({ item, height }: { item: typeof REELS_DATA[0]; height: number }) {
  const [liked, setLiked] = useState(false);
  const insets = useSafeAreaInsets();

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
              <View style={styles.userRow}>
                <View style={styles.userAvatar}>
                  <Ionicons name="person" size={18} color="#fff" />
                </View>
                <Text style={styles.userName}>{item.user}</Text>
                <TouchableOpacity style={styles.followBtn} activeOpacity={0.7}>
                  <Text style={styles.followText}>Follow</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.caption}>{item.caption}</Text>
              <View style={styles.musicRow}>
                <Ionicons name="musical-note" size={14} color="#fff" />
                <Text style={styles.musicText}>Original Audio</Text>
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7} onPress={() => setLiked(!liked)}>
                <Ionicons name={liked ? "heart" : "heart-outline"} size={30} color={liked ? "#F02849" : "#fff"} />
                <Text style={styles.actionText}>{item.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                <Ionicons name="chatbubble-outline" size={28} color="#fff" />
                <Text style={styles.actionText}>{item.comments}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                <Ionicons name="bookmark-outline" size={26} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                <Ionicons name="paper-plane-outline" size={26} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                <Ionicons name="ellipsis-horizontal" size={26} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

export default function VideosScreen() {
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
      <View style={styles.container} onLayout={(e) => setViewHeight(e.nativeEvent.layout.height)}>
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
        <Text style={styles.headerTitle}>Reels</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7} onPress={() => setSearching(true)}>
            <Ionicons name="search" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7} onPress={() => router.push("/profile" as any)}>
            <Ionicons name="person-circle-outline" size={22} color="#fff" />
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
    backgroundColor: "#000",
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
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.8)",
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
    backgroundColor: "rgba(0,0,0,0.45)",
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
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  userName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  followBtn: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  followText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#fff",
  },
  caption: {
    fontSize: 14,
    color: "#fff",
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
    color: "#fff",
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
    color: "#fff",
    fontWeight: "600",
  },
});
