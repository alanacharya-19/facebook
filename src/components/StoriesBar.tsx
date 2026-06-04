import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
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
const GRADIENT = ["#833AB4", "#FD1D1D", "#F77737", "#FCAF45"];

export default function StoriesBar() {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {STORIES.map((story, i) => (
          <TouchableOpacity key={story.id} activeOpacity={0.8} style={styles.story}>
            <View style={[styles.storyCard, { backgroundColor: COLORS[i % COLORS.length] }]}>
              {story.isSelf ? (
                <>
                  <View style={styles.selfAvatarWrap}>
                    <View style={styles.selfAvatar}>
                      <Ionicons name="person" size={32} color="#fff" />
                    </View>
                  </View>
                  <View style={styles.addBadge}>
                    <Ionicons name="add" size={16} color="#fff" />
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.storyRing}>
                    <View style={styles.storyAvatar}>
                      <Ionicons name="person" size={28} color="#fff" />
                    </View>
                  </View>
                </>
              )}
              <Text style={styles.name} numberOfLines={1}>
                {story.name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const CARD_W = 104;
const CARD_H = 168;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderBottomWidth: 6,
    borderBottomColor: "#F0F2F5",
  },
  scroll: {
    paddingHorizontal: 12,
    gap: 8,
  },
  story: {
    width: CARD_W,
  },
  storyCard: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 14,
    overflow: "hidden",
    padding: 10,
    justifyContent: "flex-end",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  selfAvatarWrap: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  selfAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: "#1877F2",
    backgroundColor: "#1877F2",
    alignItems: "center",
    justifyContent: "center",
  },
  addBadge: {
    position: "absolute",
    bottom: 36,
    alignSelf: "center",
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#1877F2",
    borderWidth: 3,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  storyRing: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#1877F2",
    alignItems: "center",
    justifyContent: "center",
  },
  storyAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 12,
    fontWeight: "500",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
