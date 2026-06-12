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
import { router } from "expo-router";
import ProfileSidebar from "../../components/ProfileSidebar";
import SearchOverlay from "../../components/SearchOverlay";
import { PROFILE, PROFILE_FRIENDS, PROFILE_HIGHLIGHTS, PROFILE_TABS, USER_POSTS } from "../../data/profile";

function ProfilePost({ avatar, name, time, content, image, likes, comments }: any) {
  const [liked, setLiked] = useState(false);
  return (
    <View style={styles.profilePostCard}>
      <View style={styles.profilePostTop}>
        <Image source={{ uri: avatar }} style={styles.profilePostAvatar} />
        <View style={styles.profilePostHeaderText}>
          <Text style={styles.profilePostName}>{name}</Text>
          <View style={styles.profilePostTimeRow}>
            <Text style={styles.profilePostTime}>{time}</Text>
            <Ionicons name="globe-outline" size={12} color="#65676B" />
          </View>
        </View>
        <TouchableOpacity style={styles.profilePostMenu}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#65676B" />
        </TouchableOpacity>
      </View>
      <Text style={styles.profilePostContent}>{content}</Text>
      <Image source={{ uri: image }} style={styles.profilePostImage} />
      <View style={styles.profilePostFooter}>
        <View style={styles.profilePostFooterLeft}>
          <TouchableOpacity style={styles.profilePostFooterItem} activeOpacity={0.7} onPress={() => setLiked(!liked)}>
            <Ionicons name={liked ? "heart" : "heart-outline"} size={20} color={liked ? "#F02849" : "#65676B"} />
            <Text style={[styles.profilePostFooterText, liked && { color: "#F02849" }]}>{liked ? likes + 1 : likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profilePostFooterItem} activeOpacity={0.7}>
            <Ionicons name="chatbubble-outline" size={20} color="#65676B" />
            <Text style={styles.profilePostFooterText}>{comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profilePostFooterItem} activeOpacity={0.7}>
            <Ionicons name="arrow-redo-outline" size={20} color="#65676B" />
            <Text style={styles.profilePostFooterText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);
  const [searching, setSearching] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.coverWrap}>
          <ImageBackground source={{ uri: PROFILE.cover }} style={styles.cover} resizeMode="cover">
            <TouchableOpacity style={styles.menuCoverBtn} activeOpacity={0.7} onPress={() => setMenuVisible(true)}>
              <Ionicons name="menu-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.coverRight}>
              <TouchableOpacity style={styles.coverIconBtn} activeOpacity={0.7}>
                <Ionicons name="pencil" size={18} color="#050505" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.coverIconBtn} activeOpacity={0.7} onPress={() => setSearching(true)}>
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
              <Image source={{ uri: PROFILE.avatar }} style={styles.avatar} />
              <TouchableOpacity style={styles.cameraAvatarBtn} activeOpacity={0.7}>
                <Ionicons name="camera" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{PROFILE.name}</Text>
              <View style={styles.statsRow}>
                <Text style={styles.statsText}><Text style={styles.bold}>{PROFILE.friends}</Text> friends</Text>
                <Text style={styles.statsDot}> · </Text>
                <Text style={styles.statsText}><Text style={styles.bold}>{PROFILE.posts}</Text> posts</Text>
              </View>
            </View>
          </View>

          <View style={styles.info}>
            <View style={styles.detailsRow}>
              <Ionicons name="location" size={16} color="#050505" />
              <Text style={styles.detailText}>{PROFILE.location}</Text>
              <Ionicons name="school" size={16} color="#050505" />
              <Text style={styles.detailText}>{PROFILE.study}</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.8}>
              <Ionicons name="add-circle" size={18} color="#fff" />
              <Text style={styles.primaryBtnText}>Add to Story</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.8}>
              <Ionicons name="pencil" size={18} color="#050505" />
              <Text style={styles.secondaryBtnText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsRow}>
            {PROFILE_TABS.map((tab, i) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, i === activeTab && styles.activeTab]}
                onPress={() => setActiveTab(i)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, i === activeTab && styles.activeTabText]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.postsSection}>
            {activeTab === 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Personal Details</Text>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Ionicons name="pencil" size={18} color="#65676B" />
                  </TouchableOpacity>
                </View>
                <View style={styles.detailBlock}>
                  <View style={styles.detailIconBg}><Ionicons name="location-outline" size={16} color="#1877F2" /></View>
                  <Text style={styles.detailBlockText}>Lives in <Text style={styles.bold}>{PROFILE.location}</Text></Text>
                </View>
                <View style={styles.detailBlock}>
                  <View style={styles.detailIconBg}><Ionicons name="home-outline" size={16} color="#1877F2" /></View>
                  <Text style={styles.detailBlockText}>From <Text style={styles.bold}>{PROFILE.hometown}</Text></Text>
                </View>
                <View style={styles.detailBlock}>
                  <View style={styles.detailIconBg}><MaterialIcons name="cake" size={16} color="#1877F2" /></View>
                  <Text style={styles.detailBlockText}>Born on <Text style={styles.bold}>{PROFILE.birthday}</Text></Text>
                </View>

                <View style={[styles.sectionHeader, { marginTop: 20 }]}>
                  <Text style={styles.sectionTitle}>Education</Text>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Ionicons name="pencil" size={18} color="#65676B" />
                  </TouchableOpacity>
                </View>
                <View style={styles.detailBlock}>
                  <View style={styles.detailIconBg}><Ionicons name="school-outline" size={16} color="#1877F2" /></View>
                  <Text style={styles.detailBlockText}>Studied at <Text style={styles.bold}>{PROFILE.study}</Text></Text>
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

                <View style={styles.postsHeader}>
                  <Text style={styles.postsTitle}>All Posts</Text>
                  <TouchableOpacity style={styles.filterBtn} activeOpacity={0.7}>
                    <Ionicons name="options-outline" size={16} color="#65676B" />
                    <Text style={styles.filterText}>Filter</Text>
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
                <Ionicons name="images-outline" size={48} color="#BCC0C4" />
                <Text style={styles.emptyText}>No photos yet</Text>
              </View>
            )}
            {activeTab === 2 && (
              <View style={styles.emptyTab}>
                <Ionicons name="play-outline" size={48} color="#BCC0C4" />
                <Text style={styles.emptyText}>No reels yet</Text>
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
    backgroundColor: "#fff",
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
    borderColor: "#fff",
  },
  cameraAvatarBtn: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E4E6EB",
    borderWidth: 2,
    borderColor: "#fff",
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
    color: "#050505",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  statsText: {
    fontSize: 14,
    color: "#65676B",
  },
  statsDot: {
    fontSize: 14,
    color: "#65676B",
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
    color: "#050505",
    fontWeight: "500",
    marginRight: 8,
  },
  bold: {
    fontWeight: "600",
    color: "#050505",
  },
  profileBody: {
    backgroundColor: "#fff",
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
    backgroundColor: "#1877F2",
    borderRadius: 8,
    paddingVertical: 10,
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
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
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#050505",
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
    backgroundColor: "#E4E6EB",
  },
  activeTab: {
    backgroundColor: "#1877F2",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#65676B",
  },
  activeTabText: {
    color: "#fff",
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
    color: "#050505",
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#65676B",
  },
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
    color: "#050505",
  },
  profilePostTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  profilePostTime: {
    fontSize: 12,
    color: "#65676B",
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
  emptyTab: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#65676B",
  },
});
