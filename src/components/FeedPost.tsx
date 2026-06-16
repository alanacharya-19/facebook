import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Comment, POST_COMMENTS } from "../data/comments";
import { USERS } from "../data/users";
import Avatar from "./Avatar";
import ShareModal from "./ShareModal";
import { useTheme } from "../theme/ThemeContext";

type FeedPostProps = {
  name: string;
  time: string;
  content?: string;
  avatar: string;
  photo?: string;
  photos?: string[];
  userId?: string;
  postId?: string;
  onClose?: () => void;
};

const currentUser = Object.values(USERS)[0];
const isOwnPost = (uid?: string) => uid === currentUser.name.toLowerCase();

export default function FeedPost({
  name,
  time,
  content,
  avatar,
  photo,
  photos: photosProp,
  userId,
  postId = "1",
  onClose,
}: FeedPostProps) {
  const { colors } = useTheme();
  const [liked, setLiked] = useState(false);
  const heartScale = useRef(new Animated.Value(1)).current;
  const [showComments, setShowComments] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
  const [comments, setComments] = useState<Comment[]>(
    POST_COMMENTS[postId] || [],
  );
  const [newComment, setNewComment] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const own = isOwnPost(userId);

  const displayPhotos = photosProp || (photo ? [photo] : []);
  const imgCount = displayPhotos.length;

  const menuItems = own
    ? ["Edit post", "Pin post", "Delete post", "Hide from timeline"]
    : ["Hide post", "Snooze for 30 days", "Report post"];

  const totalComments = comments.length;
  const commentsLabel =
    totalComments > 0
      ? `${totalComments >= 1000 ? `${(totalComments / 1000).toFixed(1)}K` : totalComments}`
      : "Comment";

  const pulse = () => {
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1.4, useNativeDriver: true, friction: 3 }),
      Animated.spring(heartScale, { toValue: 1, useNativeDriver: true, friction: 3 }),
    ]).start();
  };

  const handleLike = () => {
    if (!liked) pulse();
    setLiked(!liked);
  };

  const goToProfile = () => {
    if (userId) router.push(`/profile/${userId}` as any);
  };

  const toggleCommentLike = (id: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              liked: !c.liked,
              likes: c.liked ? c.likes - 1 : c.likes + 1,
            }
          : c,
      ),
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
    <View style={[styles.card, { backgroundColor: colors.card, borderBottomColor: colors.borderLight }]}>
      {menuOpen && (
        <TouchableOpacity
          style={styles.menuBackdrop}
          activeOpacity={1}
          onPress={() => setMenuOpen(false)}
        />
      )}
      {menuOpen && (
        <View style={[styles.menuDropdown, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.menuItem, { borderBottomColor: colors.borderLight }]}
              activeOpacity={0.7}
              onPress={() => {
                setMenuOpen(false);
                if (item === "Hide post" || item === "Hide from timeline")
                  onClose?.();
              }}
            >
              <Text style={[styles.menuItemText, { color: colors.text }]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.header}>
        <TouchableOpacity onPress={goToProfile} activeOpacity={0.7}>
          <Avatar uri={avatar} size={40} style={styles.avatar} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <View style={styles.nameRow}>
            <TouchableOpacity onPress={goToProfile} activeOpacity={0.7}>
              <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.followBtn, { backgroundColor: colors.primaryLight }]} activeOpacity={0.7}>
              <Text style={[styles.followText, { color: colors.primary }]}>Follow</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.timeRow}>
            <Text style={[styles.time, { color: colors.textSecondary }]}>{time}</Text>
            <Ionicons name="globe-outline" size={12} color={colors.textSecondary} />
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 2 }}>
          <TouchableOpacity
            style={styles.menuBtn}
            onPress={() => setMenuOpen(!menuOpen)}
          >
            <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          {onClose && (
            <TouchableOpacity style={styles.menuBtn} onPress={onClose}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {content ? <Text style={[styles.content, { color: colors.text }]}>{content}</Text> : null}

      {imgCount > 0 && (
        <TouchableOpacity activeOpacity={0.95} onPress={() => setViewerIndex(0)}>
          {imgCount === 1 ? (
            <View style={[styles.imageWrap, { borderColor: colors.border }]}>
              <Image source={{ uri: displayPhotos[0] }} style={styles.postImage} />
            </View>
          ) : (
            <View style={[styles.collage, { borderColor: colors.border }]}>
              {imgCount === 2 ? (
                <View style={styles.collageRow}>
                  <Image source={{ uri: displayPhotos[0] }} style={styles.collageHalf} />
                  <Image source={{ uri: displayPhotos[1] }} style={styles.collageHalf} />
                </View>
              ) : imgCount === 3 ? (
                <View style={styles.collage3}>
                  <Image source={{ uri: displayPhotos[0] }} style={styles.collageLeft} />
                  <View style={styles.collageRight}>
                    <Image source={{ uri: displayPhotos[1] }} style={styles.collageQuad} />
                    <Image source={{ uri: displayPhotos[2] }} style={styles.collageQuad} />
                  </View>
                </View>
              ) : (
                <View style={styles.collage4}>
                  <Image source={{ uri: displayPhotos[0] }} style={styles.collageLeft} />
                  <View style={styles.collageRight}>
                    <Image source={{ uri: displayPhotos[1] }} style={styles.collageQuad} />
                    <View style={styles.collageRow}>
                      <Image source={{ uri: displayPhotos[2] }} style={styles.collageQuad} />
                      <View style={styles.collageLastWrap}>
                        <Image source={{ uri: displayPhotos[3] }} style={styles.collageQuad} />
                        {imgCount > 4 && (
                          <View style={styles.collageOverlay}>
                            <Text style={styles.collageOverlayText}>+{imgCount - 4}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}
        </TouchableOpacity>
      )}

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <View style={styles.footerLeft}>
          <TouchableOpacity
            style={styles.footerItem}
            activeOpacity={0.7}
            onPress={handleLike}
          >
            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
              <Ionicons
                name={liked ? "heart" : "heart-outline"}
                size={20}
                color={liked ? "#F02849" : colors.textSecondary}
              />
            </Animated.View>
            <Text style={[styles.footerText, { color: liked ? "#F02849" : colors.textSecondary }]}>
              200K
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerItem}
            activeOpacity={0.7}
            onPress={() => setShowComments(!showComments)}
          >
            <Ionicons
              name="chatbubble-outline"
              size={20}
              color={showComments ? "#1877F2" : colors.textSecondary}
            />
            <Text
              style={[styles.footerText, { color: showComments ? "#1877F2" : colors.textSecondary }]}
            >
              {commentsLabel}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerItem}
            activeOpacity={0.7}
            onPress={() => setShareVisible(true)}
          >
            <Ionicons name="arrow-redo-outline" size={20} color={colors.textSecondary} />
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showComments && (
        <View style={styles.commentsSection}>
          <View style={[styles.commentsDivider, { backgroundColor: colors.borderLight }]} />

          <View style={styles.commentInputRow}>
            <Avatar
              uri={currentUser.avatar}
              size={28}
              style={styles.commentInputAvatar}
            />
            <View style={[styles.commentInputWrap, { backgroundColor: colors.inputBg }]}>
              <TextInput
                placeholder="Write a comment..."
                placeholderTextColor={colors.textTertiary}
                style={[styles.commentInput, { color: colors.text }]}
                value={newComment}
                onChangeText={setNewComment}
              />
            </View>
            <TouchableOpacity
              style={[
                styles.commentSendBtn,
                !newComment.trim() && { opacity: 0.4 },
              ]}
              activeOpacity={0.7}
              onPress={handleSendComment}
              disabled={!newComment.trim()}
            >
              <Ionicons name="paper-plane" size={18} color="#1877F2" />
            </TouchableOpacity>
          </View>

          {comments.length === 0 && (
            <Text style={[styles.noComments, { color: colors.textSecondary }]}>
              No comments yet. Be the first!
            </Text>
          )}

          {comments.slice(0, 5).map((comment) => (
            <View key={comment.id} style={styles.commentRow}>
              <Avatar
                uri={comment.avatar}
                size={32}
                style={styles.commentAvatar}
              />
              <View style={[styles.commentBubble, { backgroundColor: colors.inputBg }]}>
                <Text style={[styles.commentName, { color: colors.text }]}>{comment.name}</Text>
                <Text style={[styles.commentText, { color: colors.text }]}>{comment.text}</Text>
                <View style={styles.commentActions}>
                  <TouchableOpacity
                    onPress={() => toggleCommentLike(comment.id)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.commentActionText,
                        { color: comment.liked ? "#F02849" : colors.textSecondary },
                      ]}
                    >
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
                        <Text style={[styles.commentActionText, { color: colors.textSecondary }]}>
                          {comment.replies} replies
                        </Text>
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
              <Text style={[styles.viewMoreText, { color: colors.textSecondary }]}>
                View all {comments.length} comments
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <ShareModal
        visible={shareVisible}
        onClose={() => setShareVisible(false)}
      />

      {viewerIndex !== null && (
        <PhotoViewer
          photos={displayPhotos}
          initialIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}
    </View>
  );
}

function PhotoViewer({ photos, initialIndex, onClose }: { photos: string[]; initialIndex: number; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(initialIndex);
  const { width, height } = Dimensions.get("window");

  return (
    <Modal visible animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.viewerContainer}>
        <View style={[styles.viewerHeader, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.viewerCounter}>{index + 1} / {photos.length}</Text>
          <View style={{ width: 28 }} />
        </View>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={{ flex: 1 }}
          contentOffset={{ x: index * width, y: 0 }}
          onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        >
          {photos.map((uri, i) => (
            <Image key={i} source={{ uri }} style={{ width, height, resizeMode: "contain" }} />
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 6,
    marginHorizontal: 12,
    borderRadius: 12,
    alignSelf: "center",
    maxWidth: 680,
    width: "100%",
    overflow: "visible",
    borderBottomWidth: 6,
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
  },
  followBtn: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  followText: {
    fontSize: 12,
    fontWeight: "600",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  time: {
    fontSize: 12,
  },
  menuBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  menuBackdrop: {
    position: "absolute",
    top: -9999,
    left: -9999,
    right: -9999,
    bottom: -9999,
    zIndex: 99,
  },
  menuDropdown: {
    position: "absolute",
    top: 52,
    right: 12,
    zIndex: 100,
    borderRadius: 10,
    minWidth: 200,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 0.5,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  menuItemText: {
    fontSize: 14,
  },
  headerIcon: {},
  content: {
    fontSize: 15,
    lineHeight: 21,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  imageWrap: {
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
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
  },
  commentsSection: {
    paddingTop: 4,
    paddingBottom: 8,
  },
  commentsDivider: {
    height: 1,
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
  },
  collage: {
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    overflow: "hidden",
  },
  collageRow: {
    flexDirection: "row",
    gap: 2,
    flex: 1,
  },
  collageHalf: {
    flex: 1,
    height: 220,
    resizeMode: "cover",
  },
  collage3: {
    flexDirection: "row",
    gap: 2,
    height: 220,
  },
  collage4: {
    flexDirection: "row",
    gap: 2,
    height: 220,
  },
  collageLeft: {
    flex: 1,
    borderRadius: 0,
  },
  collageRight: {
    flex: 1,
    gap: 2,
  },
  collageQuad: {
    flex: 1,
    borderRadius: 0,
  },
  collageLastWrap: {
    flex: 1,
  },
  collageOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  collageOverlayText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
  },
  viewerContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  viewerHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  viewerCounter: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
