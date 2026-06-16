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
import { useTheme } from "../../theme/ThemeContext";
import { getUserData, USERS } from "../../data/users";
import { USER_POSTS, PROFILE_FRIENDS, PROFILE_HIGHLIGHTS } from "../../data/profile";
import { POST_COMMENTS, Comment } from "../../data/comments";
import ShareModal from "../../components/ShareModal";
import Avatar from "../../components/Avatar";

const currentUser = Object.values(USERS)[0];

export default function UserProfileScreen() {
  const { colors, isDark } = useTheme();
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
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
        <View style={styles.coverWrap}>
          <ImageBackground source={{ uri: user.cover }} style={styles.cover} resizeMode="cover">
            <TouchableOpacity style={[styles.backBtn, { backgroundColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.3)" }]} activeOpacity={0.7} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.coverRight}>
              <TouchableOpacity style={[styles.coverIconBtn, { backgroundColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.9)" }]} activeOpacity={0.7} onPress={() => router.push("/search")}>
                <Ionicons name="search" size={18} color={isDark ? colors.white : colors.text} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.coverIconBtn, { backgroundColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.9)" }]} activeOpacity={0.7}>
                <Ionicons name="ellipsis-horizontal" size={18} color={isDark ? colors.white : colors.text} />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        <View style={[styles.profileBody, { backgroundColor: colors.card }]}>
          <View style={styles.profileTop}>
            <View style={styles.avatarWrap}>
              <Avatar uri={user.avatar} size={120} style={[styles.avatar, { borderColor: colors.card }]} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
              <View style={styles.statsRow}>
                <Text style={[styles.statsText, { color: colors.textSecondary }]}><Text style={[styles.bold, { color: colors.text }]}>{user.friends}</Text> friends</Text>
                <Text style={[styles.statsDot, { color: colors.textSecondary }]}> · </Text>
                <Text style={[styles.statsText, { color: colors.textSecondary }]}><Text style={[styles.bold, { color: colors.text }]}>{user.posts}</Text> posts</Text>
              </View>
            </View>
          </View>

          <View style={styles.info}>
            <View style={styles.detailsRow}>
              <Ionicons name="location" size={16} color={colors.text} />
              <Text style={[styles.detailText, { color: colors.text }]}>{user.location}</Text>
              <Ionicons name="school" size={16} color={colors.text} />
              <Text style={[styles.detailText, { color: colors.text }]}>{user.study}</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: colors.primary }]} activeOpacity={0.8}>
              <Ionicons name="person-add" size={18} color={colors.white} />
              <Text style={[styles.primaryBtnText, { color: colors.white }]}>Add Friend</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.secondaryBtn, { backgroundColor: colors.cardSecondary }]} activeOpacity={0.8}>
              <Ionicons name="chatbubble-outline" size={18} color={colors.text} />
              <Text style={[styles.secondaryBtnText, { color: colors.text }]}>Message</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.personalDetails}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Details</Text>
            </View>
            <View style={styles.detailBlock}>
              <View style={[styles.detailIconBg, { backgroundColor: colors.primaryLight }]}><Ionicons name="location-outline" size={16} color={colors.primary} /></View>
              <Text style={[styles.detailBlockText, { color: colors.text }]}>Lives in <Text style={[styles.bold, { color: colors.text }]}>{user.location}</Text></Text>
            </View>
            <View style={styles.detailBlock}>
              <View style={[styles.detailIconBg, { backgroundColor: colors.primaryLight }]}><Ionicons name="home-outline" size={16} color={colors.primary} /></View>
              <Text style={[styles.detailBlockText, { color: colors.text }]}>From <Text style={[styles.bold, { color: colors.text }]}>{user.hometown}</Text></Text>
            </View>
            <View style={styles.detailBlock}>
              <View style={[styles.detailIconBg, { backgroundColor: colors.primaryLight }]}><MaterialIcons name="cake" size={16} color={colors.primary} /></View>
              <Text style={[styles.detailBlockText, { color: colors.text }]}>Born on <Text style={[styles.bold, { color: colors.text }]}>{user.birthday}</Text></Text>
            </View>

            <View style={[styles.sectionHeader, { marginTop: 20 }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Education</Text>
            </View>
            <View style={styles.detailBlock}>
              <View style={[styles.detailIconBg, { backgroundColor: colors.primaryLight }]}><Ionicons name="school-outline" size={16} color={colors.primary} /></View>
              <Text style={[styles.detailBlockText, { color: colors.text }]}>Studied at <Text style={[styles.bold, { color: colors.text }]}>{user.study}</Text></Text>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Friends</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.friendsRow}>
              {PROFILE_FRIENDS.map((f) => (
                <TouchableOpacity key={f.id} style={styles.friendCard} activeOpacity={0.7}>
                  <Avatar uri={f.avatar} size={64} style={styles.friendAvatarCircle} />
                  <Text style={[styles.friendName, { color: colors.text }]} numberOfLines={1}>{f.name}</Text>
                  <Text style={[styles.friendMutual, { color: colors.textSecondary }]}>{f.mutual} mutual friends</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Highlights</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.highlightsRow}>
              <TouchableOpacity style={styles.highlightAdd} activeOpacity={0.7}>
                <View style={[styles.highlightAddRect, { borderColor: colors.border }]}>
                  <Ionicons name="add" size={24} color={colors.primary} />
                </View>
                <Text style={[styles.highlightAddText, { color: colors.textSecondary }]}>Create</Text>
              </TouchableOpacity>
              {PROFILE_HIGHLIGHTS.map((h) => (
                <TouchableOpacity key={h.id} style={styles.highlightItem} activeOpacity={0.7}>
                  <Image source={{ uri: h.cover }} style={styles.highlightRect} />
                  <Text style={[styles.highlightTitle, { color: colors.text }]}>{h.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.postsSection}>
            <View style={styles.postsHeader}>
              <Text style={[styles.postsTitle, { color: colors.text }]}>Posts</Text>
            </View>
            {USER_POSTS.map((post) => (
              <View key={post.id} style={[styles.profilePostCard, { backgroundColor: colors.card, borderBottomColor: colors.cardSecondary }]}>
                <View style={styles.profilePostTop}>
                  <Avatar uri={user.avatar} size={40} style={styles.profilePostAvatar} />
                  <View style={styles.profilePostHeaderText}>
                    <Text style={[styles.profilePostName, { color: colors.text }]}>{user.name}</Text>
                    <View style={styles.profilePostTimeRow}>
                      <Text style={[styles.profilePostTime, { color: colors.textSecondary }]}>{post.time}</Text>
                      <Ionicons name="globe-outline" size={12} color={colors.textSecondary} />
                    </View>
                  </View>
                  <TouchableOpacity style={styles.profilePostMenu}>
                    <Ionicons name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.profilePostContent, { color: colors.text }]}>{post.content}</Text>
                <Image source={{ uri: post.image }} style={[styles.profilePostImage, { borderColor: colors.border }]} />
                <View style={[styles.profilePostFooter, { borderTopColor: colors.border }]}>
                  <View style={styles.profilePostFooterLeft}>
                    <TouchableOpacity style={styles.profilePostFooterItem} activeOpacity={0.7} onPress={() => toggleLike(post.id)}>
                      <Ionicons name={likedPosts[post.id] ? "heart" : "heart-outline"} size={20} color={likedPosts[post.id] ? colors.danger : colors.textSecondary} />
                      <Text style={[styles.profilePostFooterText, { color: colors.textSecondary }, likedPosts[post.id] && { color: colors.danger }]}>{likedPosts[post.id] ? post.likes + 1 : post.likes}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.profilePostFooterItem} activeOpacity={0.7} onPress={() => setExpandedComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}>
                      <Ionicons name="chatbubble-outline" size={20} color={expandedComments[post.id] ? colors.primary : colors.textSecondary} />
                      <Text style={[styles.profilePostFooterText, { color: colors.textSecondary }, expandedComments[post.id] && { color: colors.primary }]}>{(allComments[post.id] || []).length}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.profilePostFooterItem} activeOpacity={0.7} onPress={() => setShareVisible(true)}>
                      <Ionicons name="arrow-redo-outline" size={20} color={colors.textSecondary} />
                      <Text style={[styles.profilePostFooterText, { color: colors.textSecondary }]}>Share</Text>
                    </TouchableOpacity>
                  </View>
                  {expandedComments[post.id] && (
                    <View style={styles.inlineComments}>
                      <View style={styles.commentInputRow}>
                        <Avatar uri={currentUser.avatar} size={28} style={styles.commentInputAvatar} />
                        <View style={[styles.commentInputWrap, { backgroundColor: colors.inputBg }]}>
                          <TextInput
                            placeholder="Write a comment..."
                            placeholderTextColor={colors.textTertiary}
                            style={[styles.commentInput, { color: colors.text }]}
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
                          <Ionicons name="paper-plane" size={18} color={colors.primary} />
                        </TouchableOpacity>
                      </View>

                      {(allComments[post.id] || []).length === 0 && (
                        <Text style={[styles.noComments, { color: colors.textSecondary }]}>No comments yet. Be the first!</Text>
                      )}

                      {(allComments[post.id] || []).slice(0, 5).map((comment) => (
                        <View key={comment.id} style={styles.commentRow}>
                          <Avatar uri={comment.avatar} size={32} style={styles.commentAvatar} />
                          <View style={[styles.commentBubble, { backgroundColor: colors.inputBg }]}>
                            <Text style={[styles.commentName, { color: colors.text }]}>{comment.name}</Text>
                            <Text style={[styles.commentText, { color: colors.text }]}>{comment.text}</Text>
                            <View style={styles.commentActions}>
                              <TouchableOpacity onPress={() => toggleCommentLike(post.id, comment.id)} activeOpacity={0.7}>
                                <Text style={[styles.commentActionText, { color: colors.textSecondary }, comment.liked && { color: colors.danger }]}>
                                  {comment.liked ? "Unlike" : "Like"}
                                </Text>
                              </TouchableOpacity>
                              <Text style={[styles.commentDot, { color: colors.textSecondary }]}> · </Text>
                              <TouchableOpacity activeOpacity={0.7}>
                                <Text style={[styles.commentActionText, { color: colors.textSecondary }]}>Reply</Text>
                              </TouchableOpacity>
                              {comment.replies ? (
                                <>
                                  <Text style={[styles.commentDot, { color: colors.textSecondary }]}> · </Text>
                                  <TouchableOpacity activeOpacity={0.7}>
                                    <Text style={[styles.commentActionText, { color: colors.textSecondary }]}>{comment.replies} replies</Text>
                                  </TouchableOpacity>
                                </>
                              ) : null}
                            </View>
                          </View>
                          {comment.likes > 0 && (
                            <View style={[styles.commentLikeBadge, { backgroundColor: colors.danger }]}>
                              <Ionicons name="heart" size={10} color={colors.white} />
                              <Text style={[styles.commentLikeText, { color: colors.white }]}>{comment.likes}</Text>
                            </View>
                          )}
                        </View>
                      ))}

                      {(allComments[post.id] || []).length > 5 && (
                        <TouchableOpacity style={styles.viewMoreBtn} activeOpacity={0.7}>
                          <Text style={[styles.viewMoreText, { color: colors.textSecondary }]}>View all {(allComments[post.id] || []).length} comments</Text>
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
  container: { flex: 1 },
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
    alignItems: "center",
    justifyContent: "center",
  },
  avatarWrap: { marginTop: -70 },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
  },
  profileTop: {
    flexDirection: "row",
    paddingHorizontal: 16,
    alignItems: "flex-end",
    gap: 12,
    marginBottom: 12,
  },
  profileInfo: { flex: 1, paddingBottom: 4 },
  name: { fontSize: 22, fontWeight: "700" },
  statsRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  statsText: { fontSize: 14 },
  statsDot: { fontSize: 14 },
  info: { paddingHorizontal: 16 },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  detailText: { fontSize: 14, fontWeight: "500", marginRight: 8 },
  bold: { fontWeight: "600" },
  profileBody: {},
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
    borderRadius: 8,
    paddingVertical: 10,
  },
  primaryBtnText: { fontSize: 14, fontWeight: "600" },
  secondaryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 8,
    paddingVertical: 10,
  },
  secondaryBtnText: { fontSize: 14, fontWeight: "600" },
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
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "500",
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
    alignItems: "center",
    justifyContent: "center",
  },
  detailBlockText: {
    fontSize: 14,
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
    marginTop: 4,
    textAlign: "center",
  },
  friendMutual: {
    fontSize: 11,
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
    textAlign: "center",
    marginTop: 4,
  },
  highlightAddText: {
    fontSize: 12,
    marginTop: 4,
  },
  postsSection: { marginTop: 16, paddingHorizontal: 16 },
  postsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  postsTitle: { fontSize: 18, fontWeight: "700" },
  profilePostCard: {
    marginBottom: 6,
    marginLeft: -16,
    marginRight: -16,
    borderBottomWidth: 6,
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
  profilePostName: { fontSize: 14, fontWeight: "600" },
  profilePostTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  profilePostTime: { fontSize: 12 },
  profilePostMenu: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  profilePostContent: {
    fontSize: 15,
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
  },
  profilePostFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 0.5,
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
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  commentInput: {
    fontSize: 13,
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
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  commentName: {
    fontSize: 12,
    fontWeight: "700",
  },
  commentText: {
    fontSize: 13,
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
  },
  commentDot: {
    fontSize: 11,
  },
  commentLikeBadge: {
    flexDirection: "row",
    alignItems: "center",
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
  },
  viewMoreBtn: {
    paddingVertical: 8,
    alignItems: "center",
  },
  viewMoreText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
