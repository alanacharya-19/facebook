import { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

type FeedPostProps = {
  name: string;
  time: string;
  content?: string;
  avatar: string;
  photo?: string;
  userId?: string;
};

export default function FeedPost({ name, time, content, avatar, photo, userId }: FeedPostProps) {
  const [liked, setLiked] = useState(false);

  const goToProfile = () => {
    if (userId) router.push(`/profile/${userId}`);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goToProfile} activeOpacity={0.7}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <View style={styles.nameRow}>
            <TouchableOpacity onPress={goToProfile} activeOpacity={0.7}>
              <Text style={styles.name}>{name}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.followBtn} activeOpacity={0.7}>
              <Text style={styles.followText}>Follow</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.time}>{time}</Text>
            <Ionicons name="globe-outline" size={12} color="#65676B" />
          </View>
        </View>
        <TouchableOpacity style={styles.menuBtn}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#65676B" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeBtn}>
          <Ionicons name="close" size={20} color="#65676B" />
        </TouchableOpacity>
      </View>

      {content ? <Text style={styles.content}>{content}</Text> : null}

      {photo && (
        <View style={styles.imageWrap}>
          <Image source={{ uri: photo }} style={styles.postImage} />
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <TouchableOpacity style={styles.footerItem} activeOpacity={0.7} onPress={() => setLiked(!liked)}>
            <Ionicons name={liked ? "heart" : "heart-outline"} size={20} color={liked ? "#F02849" : "#65676B"} />
            <Text style={[styles.footerText, liked && { color: "#F02849" }]}>200K</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerItem} activeOpacity={0.7}>
            <Ionicons name="chatbubble-outline" size={20} color="#65676B" />
            <Text style={styles.footerText}>12K</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerItem} activeOpacity={0.7}>
            <Ionicons name="arrow-redo-outline" size={20} color="#65676B" />
            <Text style={styles.footerText}>8.5K</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    marginTop: 6,
    borderBottomWidth: 6,
    borderBottomColor: "#F0F2F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerText: {
    flex: 1,
    marginLeft: 10,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#050505",
  },
  followBtn: {
    backgroundColor: "#E7F3FF",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  followText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1877F2",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: "#65676B",
  },
  menuBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    fontSize: 15,
    color: "#050505",
    lineHeight: 21,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  imageWrap: {
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "#CED0D4",
  },
  postImage: {
    width: "100%",
    height: 220,
    resizeMode: "cover",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: "#CED0D4",
    marginTop: 6,
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  footerText: {
    fontSize: 13,
    color: "#65676B",
  },

});
