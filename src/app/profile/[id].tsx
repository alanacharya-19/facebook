import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { getUserData, USERS } from "../../data/users";
import { USER_POSTS, PROFILE_FRIENDS, PROFILE_HIGHLIGHTS } from "../../data/profile";
import { POST_COMMENTS, Comment } from "../../data/comments";
import ShareModal from "../../components/ShareModal";
import Avatar from "../../components/Avatar";

const currentUser = Object.values(USERS)[0];

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = getUserData(id);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [allComments, setAllComments] = useState<Record<string, Comment[]>>(() => {
    const initial: Record<string, Comment[]> = {};
    USER_POSTS.forEach((p) => { initial[p.id] = POST_COMMENTS[p.id] || []; });
    return initial;
  });
  const [newComments, setNewComments] = useState<Record<string, string>>({});
  const [shareVisible, setShareVisible] = useState(false);

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleCommentLike = (postId: string, commentId: string) => {
    setAllComments((prev) => ({
      ...prev,
      [postId]: (prev[postId] || []).map((c) =>
        c.id === commentId ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 } : c
      ),
    }));
  };

  const handleSendComment = (postId: string) => {
    const text = (newComments[postId] || "").trim();
    if (!text) return;
    const comment: Comment = {
      id: `c-${Date.now()}`,
      name: currentUser.name,
      avatar: currentUser.avatar,
      time: "Just now",
      text,
      likes: 0,
      liked: false,
    };
    setAllComments((prev) => ({ ...prev, [postId]: [comment, ...(prev[postId] || [])] }));
    setNewComments((prev) => ({ ...prev, [postId]: "" }));
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.coverWrap}>
          <ImageBackground source={{ uri: user.cover }} style={styles.cover} resizeMode="cover">
            <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.coverRight}>
              <TouchableOpacity style={styles.coverIconBtn} activeOpacity={0.7} onPress={() => router.push("/search")}>
                <Ionicons name="search" size={18} color="#050505" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.coverIconBtn} activeOpacity={0.7}>
                <Ionicons name="ellipsis-horizontal" size={18} color="#050505" />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.profileBody}>
          <View style={styles.profileTop}>
            <View style={styles.avatarWrap}>
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{user.name}</Text>
              <View style={styles.statsRow}>
                <Text style={styles.statsText}><Text style={styles.bold}>{user.friends}</Text> friends</Text>
                <Text style={styles.statsDot}> · </Text>
                <Text style={styles.statsText}><Text style={styles.bold}>{user.posts}</Text> posts</Text>
              </View>
            </View>
          </View>

          <View style={styles.info}>
            <View style={styles.detailsRow}>
              <Ionicons name="location" size={16} color="#050505" />
              <Text style={styles.detailText}>{user.location}</Text>
              <Ionicons name="school" size={16} color="#050505" />
              <Text style={styles.detailText}>{user.study}</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.8}>
              <Ionicons name="person-add" size={18} color="#fff" />
              <Text style={styles.primaryBtnText}>Add Friend</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.8}>
              <Ionicons name="chatbubble-outline" size={18} color="#050505" />
              <Text style={styles.secondaryBtnText}>Message</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.personalDetails}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Personal Details</Text>
            </View>
            <View style={styles.detailBlock}>
              <View style={styles.detailIconBg}><Ionicons name="location-outline" size={16} color="#1877F2" /></View>
              <Text style={styles.detailBlockText}>Lives in <Text style={styles.bold}>{user.location}</Text></Text>
            </View>
            <View style={styles.detailBlock}>
              <View style={styles.detailIconBg}><Ionicons name="home-outline" size={16} color="#1877F2" /></View>
              <Text style={styles.detailBlockText}>From <Text style={styles.bold}>{user.hometown}</Text></Text>
            </View>
            <View style={styles.detailBlock}>
              <View style={styles.detailIconBg}><MaterialIcons name="cake" size={16} color="#1877F2" /></View>
              <Text style={styles.detailBlockText}>Born on <Text style={styles.bold}>{user.birthday}</Text></Text>
            </View>

            <View style={[styles.sectionHeader, { marginTop: 20 }]}>
              <Text style={styles.sectionTitle}>Education</Text>
            </View>
            <View style={styles.detailBlock}>
              <View style={styles.detailIconBg}><Ionicons name="school-outline" size={16} color="#1877F2" /></View>
              <Text style={styles.detailBlockText}>Studied at <Text style={styles.bold}>{user.study}</Text></Text>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Friends</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.friendsRow}>
              {PROFILE_FRIENDS.map((f) => (
                <TouchableOpacity key={f.id} style={styles.friendCard} activeOpacity={0.7}>
                  <Image source={{ uri: f.avatar }} style={styles.friendAvatarCircle} />
                  <Text style={styles.friendName} numberOfLines={1}>{f.name}</Text>
                  <Text style={styles.friendMutual}>{f.mutual} mutual friends</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Highlights</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.highlightsRow}>
              <TouchableOpacity style={styles.highlightAdd} activeOpacity={0.7}>
                <View style={styles.highlightAddRect}>
                  <Ionicons name="add" size={24} color="#1877F2" />
                </View>
                <Text style={styles.highlightAddText}>Create</Text>
              </TouchableOpacity>
              {PROFILE_HIGHLIGHTS.map((h) => (
                <TouchableOpacity key={h.id} style={styles.highlightItem} activeOpacity={0.7}>
                  <Image source={{ uri: h.cover }} style={styles.highlightRect} />
                  <Text style={styles.highlightTitle}>{h.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.postsSection}>
            <View style={styles.postsHeader}>
              <Text style={styles.postsTitle}>Posts</Text>
            </View>
            {USER_POSTS.map((post) => (
              <View key={post.id} style={styles.profilePostCard}>
                <View style={styles.profilePostTop}>
                  <Image source={{ uri: user.avatar }} style={styles.profilePostAvatar} />
                  <View style={styles.profilePostHeaderText}>
                    <Text style={styles.profilePostName}>{user.name}</Text>
                    <View style={styles.profilePostTimeRow}>
                      <Text style={styles.profilePostTime}>{post.time}</Text>
                      <Ionicons name="globe-outline" size={12} color="#65676B" />
                    </View>
                  </View>
                  <TouchableOpacity style={styles.profilePostMenu}>
                    <Ionicons name="ellipsis-horizontal" size={20} color="#65676B" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.profilePostContent}>{post.content}</Text>
                <Image source={{ uri: post.image }} style={styles.profilePostImage} />
                <View style={styles.profilePostFooter}>
                  <View style={styles.profilePostFooterLeft}>
                    <TouchableOpacity style={styles.profilePostFooterItem} activeOpacity={0.7} onPress={() => toggleLike(post.id)}>
                      <Ionicons name={likedPosts[post.id] ? "heart" : "heart-outline"} size={20} color={likedPosts[post.id] ? "#F02849" : "#65676B"} />
                      <Text style={[styles.profilePostFooterText, likedPosts[post.id] && { color: "#F02849" }]}>{likedPosts[post.id] ? post.likes + 1 : post.likes}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.profilePostFooterItem} activeOpacity={0.7} onPress={() => setExpandedComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}>
                      <Ionicons name="chatbubble-outline" size={20} color={expandedComments[post.id] ? "#1877F2" : "#65676B"} />
                      <Text style={[styles.profilePostFooterText, expandedComments[post.id] && { color: "#1877F2" }]}>{(allComments[post.id] || []).length}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.profilePostFooterItem} activeOpacity={0.7} onPress={() => setShareVisible(true)}>
                      <Ionicons name="arrow-redo-outline" size={20} color="#65676B" />
                      <Text style={styles.profilePostFooterText}>Share</Text>
                    </TouchableOpacity>
                  </View>
                  {expandedComments[post.id] && (
                    <View style={styles.inlineComments}>
                      <View style={styles.commentInputRow}>
                        <Image source={{ uri: currentUser.avatar }} style={styles.commentInputAvatar} />
                        <View style={styles.commentInputWrap}>
                          <TextInput
                            placeholder="Write a comment..."
                            placeholderTextColor="#8A8D91"
                            style={styles.commentInput}
                            value={newComments[post.id] || ""}
                            onChangeText={(t) => setNewComments((prev) => ({ ...prev, [post.id]: t }))}
                          />
                        </View>
                        <TouchableOpacity
                          style={[styles.commentSendBtn, !(newComments[post.id] || "").trim() && { opacity: 0.4 }]}
                          activeOpacity={0.7}
                          onPress={() => handleSendComment(post.id)}
                          disabled={!(newComments[post.id] || "").trim()}
                        >
                          <Ionicons name="paper-plane" size={18} color="#1877F2" />
                        </TouchableOpacity>
                      </View>

                      {(allComments[post.id] || []).length === 0 && (
                        <Text style={styles.noComments}>No comments yet. Be the first!</Text>
                      )}

                      {(allComments[post.id] || []).slice(0, 5).map((comment) => (
                        <View key={comment.id} style={styles.commentRow}>
                          <Image source={{ uri: comment.avatar }} style={styles.commentAvatar} />
                          <View style={styles.commentBubble}>
                            <Text style={styles.commentName}>{comment.name}</Text>
                            <Text style={styles.commentText}>{comment.text}</Text>
                            <View style={styles.commentActions}>
                              <TouchableOpacity onPress={() => toggleCommentLike(post.id, comment.id)} activeOpacity={0.7}>
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

                      {(allComments[post.id] || []).length > 5 && (
                        <TouchableOpacity style={styles.viewMoreBtn} activeOpacity={0.7}>
                          <Text style={styles.viewMoreText}>View all {(allComments[post.id] || []).length} comments</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
      <ShareModal visible={shareVisible} onClose={() => setShareVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  coverWrap: { position: "relative" },
  cover: {
    height: 180,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: "hidden",
  },
  backBtn: {
    position: "absolute",
    top: 40,
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  coverRight: {
    position: "absolute",
    top: 40,
    right: 12,
    flexDirection: "row",
    gap: 8,
  },
  coverIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarWrap: { marginTop: -70 },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#fff",
  },
  profileTop: {
    flexDirection: "row",
    paddingHorizontal: 16,
    alignItems: "flex-end",
    gap: 12,
    marginBottom: 12,
  },
  profileInfo: { flex: 1, paddingBottom: 4 },
  name: { fontSize: 22, fontWeight: "700", color: "#050505" },
  statsRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  statsText: { fontSize: 14, color: "#65676B" },
  statsDot: { fontSize: 14, color: "#65676B" },
  info: { paddingHorizontal: 16 },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  detailText: { fontSize: 14, color: "#050505", fontWeight: "500", marginRight: 8 },
  bold: { fontWeight: "600", color: "#050505" },
  profileBody: { backgroundColor: "#fff" },
  actions: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 8,
  },
  primaryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#1877F2",
    borderRadius: 8,
    paddingVertical: 10,
  },
  primaryBtnText: { fontSize: 14, fontWeight: "600", color: "#fff" },
  secondaryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#E4E6EB",
    borderRadius: 8,
    paddingVertical: 10,
  },
  secondaryBtnText: { fontSize: 14, fontWeight: "600", color: "#050505" },
  personalDetails: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#050505",
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1877F2",
  },
  detailBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  detailIconBg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E7F3FF",
    alignItems: "center",
    justifyContent: "center",
  },
  detailBlockText: {
    fontSize: 14,
    color: "#050505",
  },
  friendsRow: {
    marginTop: 8,
    marginBottom: 4,
  },
  friendCard: {
    alignItems: "center",
    width: 80,
    marginRight: 8,
  },
  friendAvatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    resizeMode: "cover",
  },
  friendName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#050505",
    marginTop: 4,
    textAlign: "center",
  },
  friendMutual: {
    fontSize: 11,
    color: "#65676B",
    textAlign: "center",
    marginTop: 1,
  },
  highlightsRow: {
    marginTop: 4,
    marginBottom: 8,
  },
  highlightAdd: {
    alignItems: "center",
    width: 80,
    marginRight: 8,
  },
  highlightAddRect: {
    width: 64,
    height: 84,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#CED0D4",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  highlightItem: {
    alignItems: "center",
    width: 80,
    marginRight: 8,
  },
  highlightRect: {
    width: 64,
    height: 84,
    borderRadius: 12,
    resizeMode: "cover",
  },
  highlightTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#050505",
    textAlign: "center",
    marginTop: 4,
  },
  highlightAddText: {
    fontSize: 12,
    color: "#65676B",
    marginTop: 4,
  },
  postsSection: { marginTop: 16, paddingHorizontal: 16 },
  postsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  postsTitle: { fontSize: 18, fontWeight: "700", color: "#050505" },
  profilePostCard: {
    backgroundColor: "#fff",
    marginBottom: 6,
    marginLeft: -16,
    marginRight: -16,
    borderBottomWidth: 6,
    borderBottomColor: "#F0F2F5",
  },
  profilePostTop: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  profilePostAvatar: { width: 40, height: 40, borderRadius: 20 },
  profilePostHeaderText: { flex: 1, marginLeft: 10 },
  profilePostName: { fontSize: 14, fontWeight: "600", color: "#050505" },
  profilePostTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  profilePostTime: { fontSize: 12, color: "#65676B" },
  profilePostMenu: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  profilePostContent: {
    fontSize: 15,
    color: "#050505",
    lineHeight: 21,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  profilePostImage: {
    width: "100%",
    height: 220,
    resizeMode: "cover",
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "#CED0D4",
  },
  profilePostFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: "#CED0D4",
    marginTop: 6,
  },
  profilePostFooterLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  profilePostFooterItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  profilePostFooterText: {
    fontSize: 13,
    color: "#65676B",
  },
  inlineComments: {
    paddingTop: 4,
    paddingBottom: 8,
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
