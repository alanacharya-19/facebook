import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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
import { useTheme } from "../theme/ThemeContext";
import ProfileSidebar from "../components/ProfileSidebar";
import SearchOverlay from "../components/SearchOverlay";
import Avatar from "../components/Avatar";
import { PROFILE, PROFILE_FRIENDS, PROFILE_HIGHLIGHTS, PROFILE_TABS, USER_POSTS } from "../data/profile";

function ProfilePost({ avatar, name, time, content, image, likes, comments }: any) {
  const { colors } = useTheme();
  const [liked, setLiked] = useState(false);
  return (
    <View style={[styles.profilePostCard, { backgroundColor: colors.card, borderBottomColor: colors.cardSecondary }]}>
      <View style={styles.profilePostTop}>
        <Avatar uri={avatar} size={40} style={styles.profilePostAvatar} />
        <View style={styles.profilePostHeaderText}>
          <Text style={[styles.profilePostName, { color: colors.text }]}>{name}</Text>
          <View style={styles.profilePostTimeRow}>
            <Text style={[styles.profilePostTime, { color: colors.textSecondary }]}>{time}</Text>
            <Ionicons name="globe-outline" size={12} color={colors.textSecondary} />
          </View>
        </View>
        <TouchableOpacity style={styles.profilePostMenu}>
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      <Text style={[styles.profilePostContent, { color: colors.text }]}>{content}</Text>
      <Image source={{ uri: image }} style={[styles.profilePostImage, { borderColor: colors.border }]} />
      <View style={[styles.profilePostFooter, { borderTopColor: colors.border }]}>
        <View style={styles.profilePostFooterLeft}>
          <TouchableOpacity style={styles.profilePostFooterItem} activeOpacity={0.7} onPress={() => setLiked(!liked)}>
            <Ionicons name={liked ? "heart" : "heart-outline"} size={20} color={liked ? colors.danger : colors.textSecondary} />
            <Text style={[styles.profilePostFooterText, { color: colors.textSecondary }, liked && { color: colors.danger }]}>{liked ? likes + 1 : likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profilePostFooterItem} activeOpacity={0.7}>
            <Ionicons name="chatbubble-outline" size={20} color={colors.textSecondary} />
            <Text style={[styles.profilePostFooterText, { color: colors.textSecondary }]}>{comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profilePostFooterItem} activeOpacity={0.7}>
            <Ionicons name="arrow-redo-outline" size={20} color={colors.textSecondary} />
            <Text style={[styles.profilePostFooterText, { color: colors.textSecondary }]}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);
  const [searching, setSearching] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
        <View style={styles.coverWrap}>
          <ImageBackground source={{ uri: PROFILE.cover }} style={styles.cover} resizeMode="cover">
            <TouchableOpacity style={styles.menuCoverBtn} activeOpacity={0.7} onPress={() => setMenuVisible(true)}>
              <Ionicons name="menu-outline" size={24} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.coverRight}>
              <TouchableOpacity style={styles.coverIconBtn} activeOpacity={0.7}>
                <Ionicons name="pencil" size={18} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.coverIconBtn} activeOpacity={0.7} onPress={() => setSearching(true)}>
                <Ionicons name="search" size={18} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.coverIconBtn} activeOpacity={0.7}>
                <Ionicons name="ellipsis-horizontal" size={18} color={colors.text} />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        <View style={[styles.profileBody, { backgroundColor: colors.card }]}>
          <View style={styles.profileTop}>
            <View style={styles.avatarWrap}>
              <Avatar uri={PROFILE.avatar} size={120} style={[styles.avatar, { borderColor: colors.card }]} />
              <TouchableOpacity style={[styles.cameraAvatarBtn, { backgroundColor: colors.cardSecondary, borderColor: colors.card }]} activeOpacity={0.7}>
                <Ionicons name="camera" size={14} color={colors.white} />
              </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.name, { color: colors.text }]}>{PROFILE.name}</Text>
              <View style={styles.statsRow}>
                <Text style={[styles.statsText, { color: colors.textSecondary }]}><Text style={[styles.bold, { color: colors.text }]}>{PROFILE.friends}</Text> friends</Text>
                <Text style={[styles.statsDot, { color: colors.textSecondary }]}> · </Text>
                <Text style={[styles.statsText, { color: colors.textSecondary }]}><Text style={[styles.bold, { color: colors.text }]}>{PROFILE.posts}</Text> posts</Text>
              </View>
            </View>
          </View>

          <View style={styles.info}>
            <View style={styles.detailsRow}>
              <Ionicons name="location" size={16} color={colors.text} />
              <Text style={[styles.detailText, { color: colors.text }]}>{PROFILE.location}</Text>
              <Ionicons name="school" size={16} color={colors.text} />
              <Text style={[styles.detailText, { color: colors.text }]}>{PROFILE.study}</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: colors.primary }]} activeOpacity={0.8}>
              <Ionicons name="add-circle" size={18} color={colors.white} />
              <Text style={[styles.primaryBtnText, { color: colors.white }]}>Add to Story</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.secondaryBtn, { backgroundColor: colors.cardSecondary }]} activeOpacity={0.8}>
              <Ionicons name="pencil" size={18} color={colors.text} />
              <Text style={[styles.secondaryBtnText, { color: colors.text }]}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsRow}>
            {PROFILE_TABS.map((tab, i) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, { backgroundColor: colors.cardSecondary }, i === activeTab && { backgroundColor: colors.primary }]}
                onPress={() => setActiveTab(i)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, { color: colors.textSecondary }, i === activeTab && { color: colors.white }]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.postsSection}>
            {activeTab === 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Details</Text>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Ionicons name="pencil" size={18} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                <View style={styles.detailBlock}>
                  <View style={[styles.detailIconBg, { backgroundColor: colors.primaryLight }]}><Ionicons name="location-outline" size={16} color={colors.primary} /></View>
                  <Text style={[styles.detailBlockText, { color: colors.text }]}>Lives in <Text style={[styles.bold, { color: colors.text }]}>{PROFILE.location}</Text></Text>
                </View>
                <View style={styles.detailBlock}>
                  <View style={[styles.detailIconBg, { backgroundColor: colors.primaryLight }]}><Ionicons name="home-outline" size={16} color={colors.primary} /></View>
                  <Text style={[styles.detailBlockText, { color: colors.text }]}>From <Text style={[styles.bold, { color: colors.text }]}>{PROFILE.hometown}</Text></Text>
                </View>
                <View style={styles.detailBlock}>
                  <View style={[styles.detailIconBg, { backgroundColor: colors.primaryLight }]}><MaterialIcons name="cake" size={16} color={colors.primary} /></View>
                  <Text style={[styles.detailBlockText, { color: colors.text }]}>Born on <Text style={[styles.bold, { color: colors.text }]}>{PROFILE.birthday}</Text></Text>
                </View>

                <View style={[styles.sectionHeader, { marginTop: 20 }]}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Education</Text>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Ionicons name="pencil" size={18} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                <View style={styles.detailBlock}>
                  <View style={[styles.detailIconBg, { backgroundColor: colors.primaryLight }]}><Ionicons name="school-outline" size={16} color={colors.primary} /></View>
                  <Text style={[styles.detailBlockText, { color: colors.text }]}>Studied at <Text style={[styles.bold, { color: colors.text }]}>{PROFILE.study}</Text></Text>
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

                <View style={styles.postsHeader}>
                  <Text style={[styles.postsTitle, { color: colors.text }]}>All Posts</Text>
                  <TouchableOpacity style={styles.filterBtn} activeOpacity={0.7}>
                    <Ionicons name="options-outline" size={16} color={colors.textSecondary} />
                    <Text style={[styles.filterText, { color: colors.textSecondary }]}>Filter</Text>
                  </TouchableOpacity>
                </View>
                {USER_POSTS.map((post) => (
                  <ProfilePost
                    key={post.id}
                    avatar={PROFILE.avatar}
                    name={PROFILE.name}
                    time={post.time}
                    content={post.content}
                    image={post.image}
                    likes={post.likes}
                    comments={post.comments}
                  />
                ))}
              </>
            )}
            {activeTab === 1 && (
              <View style={styles.emptyTab}>
                <Ionicons name="images-outline" size={48} color={colors.textTertiary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No photos yet</Text>
              </View>
            )}
            {activeTab === 2 && (
              <View style={styles.emptyTab}>
                <Ionicons name="play-outline" size={48} color={colors.textTertiary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No reels yet</Text>
              </View>
            )}
          </View>
        </View>
        <View style={{ height: 40 }} />
        <View style={{ height: 40 }} />
      </ScrollView>
      <ProfileSidebar visible={menuVisible} onClose={() => setMenuVisible(false)} />
      {searching && <SearchOverlay onClose={() => setSearching(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coverWrap: {
    position: "relative",
  },
  cover: {
    height: 180,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: "hidden",
  },
  menuCoverBtn: {
    position: "absolute",
    top: 30,
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
    top: 30,
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
  avatarWrap: {
    marginTop: -70,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
  },
  cameraAvatarBtn: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  profileTop: {
    flexDirection: "row",
    paddingHorizontal: 16,
    alignItems: "flex-end",
    gap: 12,
    marginBottom: 12,
  },
  profileInfo: {
    flex: 1,
    paddingBottom: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  statsText: {
    fontSize: 14,
  },
  statsDot: {
    fontSize: 14,
  },
  info: {
    paddingHorizontal: 16,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  detailText: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 8,
  },
  bold: {
    fontWeight: "600",
  },
  profileBody: {
  },
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
  primaryBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 8,
    paddingVertical: 10,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },
  tabsRow: {
    marginTop: 16,
    paddingHorizontal: 16,
    flexGrow: 0,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  postsSection: {
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
  postsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    marginTop: 8,
  },
  postsTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
  },
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
  profilePostAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profilePostHeaderText: {
    flex: 1,
    marginLeft: 10,
  },
  profilePostName: {
    fontSize: 14,
    fontWeight: "600",
  },
  profilePostTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  profilePostTime: {
    fontSize: 12,
  },
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
  emptyTab: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
  },
});
