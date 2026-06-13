import { useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { POST_COMMENTS, Comment } from "../data/comments";
import { USERS } from "../data/users";

interface CommentsModalProps {
  visible: boolean;
  onClose: () => void;
  postId: string;
  postName: string;
  postAvatar: string;
  postTime: string;
  postContent?: string;
  postPhoto?: string;
}

const currentUser = Object.values(USERS)[0];

export default function CommentsModal({
  visible,
  onClose,
  postId,
  postName,
  postAvatar,
  postTime,
  postContent,
  postPhoto,
}: CommentsModalProps) {
  const [comments, setComments] = useState<Comment[]>(POST_COMMENTS[postId] || []);
  const [newComment, setNewComment] = useState("");

  const handleSend = () => {
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

  const toggleCommentLike = (id: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 } : c))
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Comments</Text>
            <TouchableOpacity style={styles.closeBtn} activeOpacity={0.7} onPress={onClose}>
              <Ionicons name="close" size={24} color="#050505" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            style={styles.list}
            ListHeaderComponent={
              <View style={styles.postPreview}>
                <View style={styles.postPreviewTop}>
                  <Image source={{ uri: postAvatar }} style={styles.postPreviewAvatar} />
                  <View style={styles.postPreviewHeaderText}>
                    <Text style={styles.postPreviewName}>{postName}</Text>
                    <Text style={styles.postPreviewTime}>{postTime}</Text>
                  </View>
                </View>
                {postContent ? <Text style={styles.postPreviewContent}>{postContent}</Text> : null}
                {postPhoto ? (
                  <Image source={{ uri: postPhoto }} style={styles.postPreviewImage} />
                ) : null}
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.commentRow}>
                <Image source={{ uri: item.avatar }} style={styles.commentAvatar} />
                <View style={styles.commentBubble}>
                  <Text style={styles.commentName}>{item.name}</Text>
                  <Text style={styles.commentText}>{item.text}</Text>
                  <View style={styles.commentActions}>
                    <TouchableOpacity onPress={() => toggleCommentLike(item.id)} activeOpacity={0.7}>
                      <Text style={[styles.commentActionText, item.liked && { color: "#F02849", fontWeight: "700" }]}>
                        {item.liked ? "Unlike" : "Like"}
                      </Text>
                    </TouchableOpacity>
                    <Text style={styles.commentDot}> · </Text>
                    <TouchableOpacity activeOpacity={0.7}>
                      <Text style={styles.commentActionText}>Reply</Text>
                    </TouchableOpacity>
                    {item.replies ? (
                      <>
                        <Text style={styles.commentDot}> · </Text>
                        <TouchableOpacity activeOpacity={0.7}>
                          <Text style={styles.commentActionText}>{item.replies} replies</Text>
                        </TouchableOpacity>
                      </>
                    ) : null}
                  </View>
                </View>
                <View style={styles.commentRight}>
                  {item.likes > 0 ? (
                    <View style={styles.likeBadge}>
                      <Ionicons name="heart" size={10} color="#fff" />
                      <Text style={styles.likeBadgeText}>{item.likes}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>No comments yet. Be the first!</Text>}
          />

          <View style={styles.inputBar}>
            <Image source={{ uri: currentUser.avatar }} style={styles.inputAvatar} />
            <View style={styles.inputWrap}>
              <TextInput
                placeholder="Write a comment..."
                placeholderTextColor="#8A8D91"
                style={styles.input}
                value={newComment}
                onChangeText={setNewComment}
                multiline
              />
            </View>
            <TouchableOpacity
              style={[styles.sendBtn, !newComment.trim() && { opacity: 0.4 }]}
              activeOpacity={0.7}
              onPress={handleSend}
              disabled={!newComment.trim()}
            >
              <Ionicons name="paper-plane" size={20} color="#1877F2" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#CED0D4",
  },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#050505" },
  closeBtn: { position: "absolute", right: 12, top: 12, width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  list: { flex: 1 },
  postPreview: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 6,
    borderBottomColor: "#F0F2F5",
  },
  postPreviewTop: { flexDirection: "row", alignItems: "center" },
  postPreviewAvatar: { width: 36, height: 36, borderRadius: 18 },
  postPreviewHeaderText: { marginLeft: 10, flex: 1 },
  postPreviewName: { fontSize: 14, fontWeight: "600", color: "#050505" },
  postPreviewTime: { fontSize: 12, color: "#65676B", marginTop: 1 },
  postPreviewContent: { fontSize: 14, color: "#050505", marginTop: 8, lineHeight: 20 },
  postPreviewImage: { width: "100%", height: 160, borderRadius: 8, marginTop: 8, resizeMode: "cover" },
  commentRow: { flexDirection: "row", paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  commentAvatar: { width: 36, height: 36, borderRadius: 18 },
  commentBubble: {
    flex: 1,
    backgroundColor: "#F0F2F5",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  commentName: { fontSize: 13, fontWeight: "700", color: "#050505" },
  commentText: { fontSize: 14, color: "#050505", marginTop: 2, lineHeight: 19 },
  commentActions: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  commentActionText: { fontSize: 12, fontWeight: "600", color: "#65676B" },
  commentDot: { fontSize: 12, color: "#65676B" },
  commentRight: { width: 30, alignItems: "flex-end" },
  likeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F02849",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 2,
  },
  likeBadgeText: { fontSize: 11, fontWeight: "700", color: "#fff" },
  emptyText: { fontSize: 14, color: "#65676B", textAlign: "center", marginTop: 20 },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 0.5,
    borderTopColor: "#CED0D4",
    gap: 8,
    backgroundColor: "#fff",
  },
  inputAvatar: { width: 32, height: 32, borderRadius: 16 },
  inputWrap: {
    flex: 1,
    backgroundColor: "#F0F2F5",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    maxHeight: 80,
  },
  input: { fontSize: 14, color: "#050505", maxHeight: 60 },
  sendBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
});
