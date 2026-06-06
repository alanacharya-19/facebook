import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type FeedPostProps = {
  name: string;
  time: string;
  content?: string;
  avatar: string;
  photo?: string;
};

export default function FeedPost({ name, time, content, avatar, photo }: FeedPostProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <View style={styles.headerText}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.timeRow}>
            <Text style={styles.time}>{time}</Text>
            <Ionicons name="globe-outline" size={12} color="#65676B" />
          </View>
        </View>
        <TouchableOpacity style={styles.menuBtn}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#65676B" />
        </TouchableOpacity>
      </View>

      {content ? <Text style={styles.content}>{content}</Text> : null}

      {photo && (
        <View style={styles.imageWrap}>
          <Image source={{ uri: photo }} style={styles.postImage} />
        </View>
      )}

      <View style={styles.stats}>
        <View style={styles.statLeft}>
          <View style={styles.likeIcon}>
            <Ionicons name="thumbs-up" size={12} color="#fff" />
          </View>
          <Text style={styles.statText}>42</Text>
        </View>
        <Text style={styles.statText}>5 comments · 2 shares</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <Ionicons name="thumbs-up-outline" size={20} color="#65676B" />
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <Ionicons name="chatbubble-outline" size={20} color="#65676B" />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <Ionicons name="share-outline" size={20} color="#65676B" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
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
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#050505",
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
  stats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  statLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  likeIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#1877F2",
    alignItems: "center",
    justifyContent: "center",
  },
  statText: {
    fontSize: 13,
    color: "#65676B",
  },
  divider: {
    height: 0.5,
    backgroundColor: "#CED0D4",
    marginHorizontal: 16,
  },
  actions: {
    flexDirection: "row",
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    borderRadius: 4,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#65676B",
  },
});
