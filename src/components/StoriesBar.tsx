import { ScrollView, View, Text, Image, TouchableOpacity, ImageBackground, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { STORIES } from "../data/home";
import Avatar from "./Avatar";

const GRADIENT = ["#833AB4", "#FD1D1D", "#F77737", "#FCAF45"];

export default function StoriesBar() {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {STORIES.map((story) => (
          <TouchableOpacity key={story.id} activeOpacity={0.8} style={styles.story} onPress={() => router.push(`/story/${story.id}` as any)}>
            {story.isSelf ? (
              <View style={styles.selfCard}>
                <ImageBackground source={{ uri: story.avatar }} style={styles.selfTop} />
                <View style={styles.selfBottom}>
                  <View style={styles.createBtn}>
                    <Ionicons name="add" size={20} color="#fff" />
                  </View>
                  <Text style={styles.createText}>Create Story</Text>
                </View>
              </View>
            ) : (
              <ImageBackground source={{ uri: story.image }} style={styles.storyCard} imageStyle={{ borderRadius: 14 }}>
                <View style={styles.storyRing}>
                  <Image source={{ uri: story.avatar }} style={styles.storyAvatar} />
                </View>
                <Text style={styles.name} numberOfLines={1}>
                  {story.name}
                </Text>
              </ImageBackground>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const CARD_W = 110;
const CARD_H = 210;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderBottomWidth: 6,
    borderBottomColor: "#F0F2F5",
  },
  scroll: {
    paddingLeft: 4,
    paddingRight: 12,
    gap: 4,
  },
  story: {
    width: CARD_W,
  },
  storyCard: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 14,
    overflow: "hidden",
    justifyContent: "flex-end",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  selfCard: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  selfTop: {
    width: CARD_W,
    height: 126,
  },
  selfBottom: {
    width: CARD_W,
    height: 84,
    backgroundColor: "#E8EAED",
    alignItems: "center",
    justifyContent: "center",
  },
  createBtn: {
    position: "absolute",
    top: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1877F2",
    borderWidth: 3,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  createText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#65676B",
    textAlign: "center",
    marginTop: 22,
  },
  storyRing: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 3,
    borderColor: "#1877F2",
    alignItems: "center",
    justifyContent: "center",
  },
  storyAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
  },
  name: {
    fontSize: 12,
    fontWeight: "500",
    color: "#fff",
    paddingHorizontal: 8,
    paddingBottom: 8,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
