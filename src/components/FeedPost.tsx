import { useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import ShareModal from "./ShareModal";
import Avatar from "./Avatar";
import { POST_COMMENTS, Comment } from "../data/comments";
import { USERS } from "../data/users";

type FeedPostProps = {
  name: string;
  time: string;
  content?: string;
  avatar: string;
  photo?: string;
  userId?: string;
  postId?: string;
  onClose?: () => void;
};

const currentUser = Object.values(USERS)[0];

export default function FeedPost({ name, time, content, avatar, photo, userId, postId = "1", onClose }: FeedPostProps) {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
  const [comments, setComments] = useState<Comment[]>(POST_COMMENTS[postId] || []);
  const [newComment, setNewComment] = useState("");

  const totalComments = comments.length;
  const commentsLabel = totalComments > 0
    ? `${totalComments >= 1000 ? `${(totalComments / 1000).toFixed(1)}K` : totalComments}`
    : "Comment";

  const goToProfile = () => {
    if (userId) router.push(`/profile/${userId}` as any);
  };

  const toggleCommentLike = (id: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 } : c))
    );
  };

  const handleSendComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: `c-${Date.now()}`,
      name: currentUser.name,
      avatar: currentUser.avatar,
      time: "Just now",
      text: newComment.trim(),
      likes: 0,
      liked: false,
    };
    setComments((prev) => [comment, ...prev]);
    setNewComment("");
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goToProfile} activeOpacity={0.7}>
          <Avatar uri={avatar} size={40} style={styles.avatar} />
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
        <View style={{ flexDirection: "row", gap: 2 }}>
          <TouchableOpacity style={styles.menuBtn}>
            <Ionicons name="ellipsis-horizontal" size={20} color="#65676B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon} onPress={onClose}>
            <Ionicons name="close" size={16} color="#65676B" />
          </TouchableOpacity>
        </View>
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
          <TouchableOpacity style={styles.footerItem} activeOpacity={0.7} onPress={() => setShowComments(!showComments)}>
            <Ionicons name="chatbubble-outline" size={20} color={showComments ? "#1877F2" : "#65676B"} />
            <Text style={[styles.footerText, showComments && { color: "#1877F2" }]}>{commentsLabel}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerItem} activeOpacity={0.7} onPress={() => setShareVisible(true)}>
            <Ionicons name="arrow-redo-outline" size={20} color="#65676B" />
            <Text style={styles.footerText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showComments && (
        <View style={styles.commentsSection}>
          <View style={styles.commentsDivider} />

          <View style={styles.commentInputRow}>
            <Avatar uri={currentUser.avatar} size={28} style={styles.commentInputAvatar} />
            <View style={styles.commentInputWrap}>
              <TextInput
                placeholder="Write a comment..."
                placeholderTextColor="#8A8D91"
                style={styles.commentInput}
                value={newComment}
                onChangeText={setNewComment}
              />
            </View>
            <TouchableOpacity
              style={[styles.commentSendBtn, !newComment.trim() && { opacity: 0.4 }]}
              activeOpacity={0.7}
              onPress={handleSendComment}
              disabled={!newComment.trim()}
            >
              <Ionicons name="paper-plane" size={18} color="#1877F2" />
            </TouchableOpacity>
          </View>

          {comments.length === 0 && (
            <Text style={styles.noComments}>No comments yet. Be the first!</Text>
          )}

          {comments.slice(0, 5).map((comment) => (
            <View key={comment.id} style={styles.commentRow}>
              <Avatar uri={comment.avatar} size={32} style={styles.commentAvatar} />
              <View style={styles.commentBubble}>
                <Text style={styles.commentName}>{comment.name}</Text>
                <Text style={styles.commentText}>{comment.text}</Text>
                <View style={styles.commentActions}>
                  <TouchableOpacity onPress={() => toggleCommentLike(comment.id)} activeOpacity={0.7}>
                    <Text style={[styles.commentActionText, comment.liked && { color: "#F02849" }]}>
                      {comment.liked ? "Unlike" : "Like"}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.commentDot}> · </Text>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Text style={styles.commentActionText}>Reply</Text>
                  </TouchableOpacity>
                  {comment.replies ? (
                    <>
                      <Text style={styles.commentDot}> · </Text>
                      <TouchableOpacity activeOpacity={0.7}>
                        <Text style={styles.commentActionText}>{comment.replies} replies</Text>
                      </TouchableOpacity>
                    </>
                  ) : null}
                </View>
              </View>
              {comment.likes > 0 && (
                <View style={styles.commentLikeBadge}>
                  <Ionicons name="heart" size={10} color="#fff" />
                  <Text style={styles.commentLikeText}>{comment.likes}</Text>
                </View>
              )}
            </View>
          ))}

          {comments.length > 5 && (
            <TouchableOpacity style={styles.viewMoreBtn} activeOpacity={0.7}>
              <Text style={styles.viewMoreText}>View all {comments.length} comments</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <ShareModal visible={shareVisible} onClose={() => setShareVisible(false)} />
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
  commentsSection: {
    paddingTop: 4,
    paddingBottom: 8,
  },
  commentsDivider: {
    height: 1,
    backgroundColor: "#E4E6EB",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  commentInputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 8,
  },
  commentInputAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  commentInputWrap: {
    flex: 1,
    backgroundColor: "#F0F2F5",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  commentInput: {
    fontSize: 13,
    color: "#050505",
    padding: 0,
  },
  commentSendBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  noComments: {
    fontSize: 13,
    color: "#65676B",
    textAlign: "center",
    marginTop: 8,
  },
  commentRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 8,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentBubble: {
    flex: 1,
    backgroundColor: "#F0F2F5",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  commentName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#050505",
  },
  commentText: {
    fontSize: 13,
    color: "#050505",
    marginTop: 1,
    lineHeight: 18,
  },
  commentActions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  commentActionText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#65676B",
  },
  commentDot: {
    fontSize: 11,
    color: "#65676B",
  },
  commentLikeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F02849",
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    gap: 2,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  commentLikeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
  },
  viewMoreBtn: {
    paddingVertical: 8,
    alignItems: "center",
  },
  viewMoreText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#65676B",
  },
});
