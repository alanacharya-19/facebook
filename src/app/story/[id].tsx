import { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  Animated,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "../../components/Avatar";
import { useLocalSearchParams, router } from "expo-router";
import { STORIES } from "../../data/home";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_W = SCREEN_WIDTH - 24;
const CARD_H = SCREEN_HEIGHT * 0.82;
const EMOJIS = ["👍", "❤️", "😮", "😢", "😡", "🎉"];

function StoryFrame({
  story,
  isActive,
  onComplete,
  userName,
}: {
  story: typeof STORIES[0];
  isActive: boolean;
  onComplete: () => void;
  userName: string;
}) {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const DURATION = 5000;

  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearTimeout(timerRef.current);
      progressAnim.setValue(0);
      return;
    }
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: DURATION,
      useNativeDriver: false,
    }).start();
    timerRef.current = setTimeout(() => {
      onComplete();
    }, DURATION);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isActive]);

  return (
    <View style={styles.frame}>
      <Image source={{ uri: story.image }} style={styles.frameImage} />
      <View style={styles.overlay}>
        <View style={styles.topArea}>
          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>
          </View>
          <View style={styles.topBar}>
            <View style={styles.userInfo}>
              <Avatar uri={story.avatar} size={36} style={styles.avatar} />
              <View>
                <Text style={styles.userName}>{story.name}</Text>
                <Text style={styles.time}>Just now</Text>
              </View>
            </View>
            <View style={styles.topRight}>
              <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
                <Ionicons name="ellipsis-horizontal" size={22} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7} onPress={() => router.back()}>
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.bottomArea}>
          <View style={styles.bottomRow}>
            <TouchableOpacity style={styles.replyBtn} activeOpacity={0.7}>
              <Ionicons name="heart-outline" size={22} color="#fff" />
            </TouchableOpacity>
            <TextInput
              placeholder={`Send message to ${userName}`}
              placeholderTextColor="rgba(255,255,255,0.6)"
              style={styles.input}
            />
            <TouchableOpacity style={styles.sendBtn} activeOpacity={0.7}>
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.emojiRow}>
            {EMOJIS.map((emoji) => (
              <TouchableOpacity key={emoji} activeOpacity={0.7}>
                <Text style={styles.emoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

export default function StoryViewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const stories = STORIES.filter((s) => !s.isSelf);
  const initialIndex = stories.findIndex((s) => s.id === id);
  const [currentIndex, setCurrentIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
  const listRef = useRef<FlatList>(null);

  const onComplete = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      listRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      router.back();
    }
  }, [currentIndex, stories.length]);

  const onMomentumEnd = useCallback((e: any) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / CARD_W);
    setCurrentIndex(idx);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: typeof STORIES[0] }) => {
      const idx = stories.findIndex((s) => s.id === item.id);
      return (
        <StoryFrame
          story={item}
          isActive={idx === currentIndex}
          onComplete={onComplete}
          userName={item.name.split(" ")[0]}
        />
      );
    },
    [currentIndex, onComplete]
  );

  if (!stories.length) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeOuter} onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        ref={listRef}
        data={stories}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
        initialScrollIndex={initialIndex >= 0 ? initialIndex : 0}
        getItemLayout={(_, index) => ({
          length: CARD_W,
          offset: CARD_W * index,
          index,
        })}
        bounces={false}
        windowSize={2}
        removeClippedSubviews={true}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  frame: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 16,
    overflow: "hidden",
    marginHorizontal: 12,
    marginVertical: (SCREEN_HEIGHT - CARD_H) / 2,
  },
  frameImage: {
    ...StyleSheet.absoluteFill,
    width: CARD_W,
    height: CARD_H,
    resizeMode: "cover",
    borderRadius: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: "space-between",
    borderRadius: 16,
    overflow: "hidden",
  },
  topArea: {
    paddingTop: 12,
    paddingHorizontal: 12,
  },
  progressRow: {
    marginBottom: 8,
  },
  progressTrack: {
    height: 3,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: 3,
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#fff",
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  time: {
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
    marginTop: 1,
  },
  topRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomArea: {
    paddingBottom: 12,
    paddingHorizontal: 12,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  replyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 14,
    fontSize: 13,
    color: "#fff",
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 8,
  },
  emoji: {
    fontSize: 22,
  },
  closeOuter: {
    position: "absolute",
    top: 50,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
