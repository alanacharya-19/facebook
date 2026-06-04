import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type FeedPostProps = {
  name: string;
  time: string;
  content?: string;
  avatarColor: string;
};

export default function FeedPost({ name, time, content, avatarColor }: FeedPostProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
          <Ionicons name="person" size={20} color="#fff" />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.timeRow}>
            <Text style={styles.time}>{time}</Text>
            <Ionicons name="globe-outline" size={12} color="#8A8D91" />
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={20} color="#8A8D91" />
        </TouchableOpacity>
      </View>

      {content ? <Text style={styles.content}>{content}</Text> : null}

      <View style={styles.imagePlaceholder}>
        <Ionicons name="image-outline" size={40} color="#BCC0C4" />
      </View>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Ionicons name="thumbs-up-outline" size={14} color="#8A8D91" />
          <Text style={styles.statText}>42</Text>
        </View>
        <Text style={styles.statText}>5 comments</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <Ionicons name="thumbs-up-outline" size={20} color="#8A8D91" />
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <Ionicons name="chatbubble-outline" size={20} color="#8A8D91" />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <Ionicons name="share-outline" size={20} color="#8A8D91" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    marginTop: 8,
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
    alignItems: "center",
    justifyContent: "center",
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
    marginTop: 1,
  },
  time: {
    fontSize: 12,
    color: "#8A8D91",
  },
  content: {
    fontSize: 14,
    color: "#050505",
    lineHeight: 20,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#F0F2F5",
    alignItems: "center",
    justifyContent: "center",
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: "#8A8D91",
  },
  divider: {
    height: 0.5,
    backgroundColor: "#DEDEDE",
    marginHorizontal: 16,
  },
  actions: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8A8D91",
  },
});
