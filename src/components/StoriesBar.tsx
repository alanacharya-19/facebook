import { ScrollView, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const STORIES = [
  { id: "1", name: "Your Story", isSelf: true },
  { id: "2", name: "Alice" },
  { id: "3", name: "Bob" },
  { id: "4", name: "Charlie" },
  { id: "5", name: "Diana" },
  { id: "6", name: "Eve" },
  { id: "7", name: "Frank" },
];

const COLORS = ["#E44D26", "#1DA1F2", "#E1306C", "#FFD700", "#00C853", "#FF6B6B", "#6C63FF"];

export default function StoriesBar() {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {STORIES.map((story, i) => (
          <View key={story.id} style={styles.story}>
            <View style={[styles.ring, story.isSelf && styles.selfRing]}>
              <View style={[styles.avatar, { backgroundColor: COLORS[i % COLORS.length] }]}>
                {story.isSelf ? (
                  <View style={styles.addBadge}>
                    <Ionicons name="add" size={14} color="#fff" />
                  </View>
                ) : null}
                <Ionicons name="person" size={28} color="#fff" />
              </View>
            </View>
            <Text style={styles.name} numberOfLines={1}>
              {story.name}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const STORY_SIZE = 64;
const RING_SIZE = STORY_SIZE + 6;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingVertical: 12,
  },
  scroll: {
    paddingHorizontal: 12,
    gap: 16,
  },
  story: {
    alignItems: "center",
    width: 76,
  },
  ring: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 3,
    borderColor: "#DEDEDE",
    alignItems: "center",
    justifyContent: "center",
  },
  selfRing: {
    borderColor: "#1877F2",
  },
  avatar: {
    width: STORY_SIZE,
    height: STORY_SIZE,
    borderRadius: STORY_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  addBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#1877F2",
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 11,
    color: "#333",
    marginTop: 4,
    maxWidth: 76,
    textAlign: "center",
  },
});
