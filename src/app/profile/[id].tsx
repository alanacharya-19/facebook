import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { getUserData, USERS } from "../../data/users";
import { USER_POSTS } from "../../data/profile";

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = getUserData(id);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
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
              <TouchableOpacity style={styles.coverIconBtn} activeOpacity={0.7}>
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
                    <TouchableOpacity style={styles.profilePostFooterItem} activeOpacity={0.7}>
                      <Ionicons name="chatbubble-outline" size={20} color="#65676B" />
                      <Text style={styles.profilePostFooterText}>{post.comments}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.profilePostFooterItem} activeOpacity={0.7}>
                      <Ionicons name="arrow-redo-outline" size={20} color="#65676B" />
                      <Text style={styles.profilePostFooterText}>Share</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
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
});
