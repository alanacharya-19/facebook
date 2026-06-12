import { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { STORIES } from "../../data/home";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const EMOJIS = ["👍", "❤️", "😮", "😢", "😡", "🎉"];

export default function StoryViewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const stories = STORIES.filter((s) => !s.isSelf);
  const initialIndex = stories.findIndex((s) => s.id === id);
  const [currentIndex, setCurrentIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentStory = stories[currentIndex];
  const DURATION = 5000;

  const startProgress = useCallback(() => {
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: DURATION,
      useNativeDriver: false,
    }).start();
    timerRef.current = setTimeout(() => {
      goNext();
    }, DURATION);
  }, [currentIndex]);

  useEffect(() => {
    startProgress();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      progressAnim.setValue(0);
    };
  }, [currentIndex]);

  const goNext = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.back();
    }
  };

  const goPrev = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleTap = (evt: any) => {
    const x = evt.nativeEvent.locationX;
    if (x < SCREEN_WIDTH * 0.3) {
      goPrev();
    } else if (x > SCREEN_WIDTH * 0.7) {
      goNext();
    }
  };

  const handleEmoji = (emoji: string) => {
    // Emoji reaction - could animate a floating emoji
  };

  if (!currentStory) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableOpacity activeOpacity={1} onPress={handleTap} style={StyleSheet.absoluteFill}>
        <ImageBackground
          source={{ uri: currentStory.image }}
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <View style={styles.overlay}>
        <View style={styles.topSection}>
          <View style={styles.progressRow}>
            {stories.map((_, i) => (
              <View key={i} style={styles.progressTrack}>
                {i === currentIndex ? (
                  <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
                ) : (
                  <View
                    style={[
                      styles.progressBar,
                      { width: i < currentIndex ? "100%" : "0%" },
                    ]}
                  />
                )}
              </View>
            ))}
          </View>

          <View style={styles.topBar}>
            <View style={styles.userInfo}>
              <Image source={{ uri: currentStory.avatar }} style={styles.avatar} />
              <View>
                <Text style={styles.userName}>{currentStory.name}</Text>
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

        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.replyBtn} activeOpacity={0.7}>
            <Ionicons name="heart-outline" size={22} color="#fff" />
          </TouchableOpacity>
          <TextInput
            placeholder={`Send message to ${currentStory.name.split(" ")[0]}`}
            placeholderTextColor="rgba(255,255,255,0.6)"
            style={styles.input}
          />
          <TouchableOpacity style={styles.sendBtn} activeOpacity={0.7}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.emojiRow}>
          {EMOJIS.map((emoji) => (
            <TouchableOpacity key={emoji} activeOpacity={0.7} onPress={() => handleEmoji(emoji)}>
              <Text style={styles.emoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: "space-between",
  },
  topSection: {
    paddingTop: 50,
    paddingHorizontal: 12,
  },
  progressRow: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 8,
  },
  progressTrack: {
    flex: 1,
    height: 3,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
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
  bottomSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 100,
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
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 16,
    fontSize: 14,
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
    paddingHorizontal: 12,
    paddingBottom: 40,
  },
  emoji: {
    fontSize: 28,
  },
  closeBtn: {
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
