import { useState, useCallback } from "react";
import { ScrollView, View, RefreshControl } from "react-native";
import { router } from "expo-router";
import TopHeader from "../../components/TopHeader";
import WhatsOnYourMind from "../../components/WhatsOnYourMind";
import StoriesBar from "../../components/StoriesBar";
import FriendSuggestions from "../../components/FriendSuggestions";
import FeedPost from "../../components/FeedPost";
import ReelsSection from "../../components/ReelsSection";
import FeedSkeleton from "../../components/FeedSkeleton";
import ProfileSidebar from "../../components/ProfileSidebar";
import { POSTS } from "../../data/home";

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [hiddenPosts, setHiddenPosts] = useState<string[]>([]);

  const onRefresh = useCallback(() => {
    setHiddenPosts([]);
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const visiblePosts = POSTS.filter((p) => !hiddenPosts.includes(p.id));

  return (
    <View style={{ flex: 1, backgroundColor: "#F0F2F5" }}>
      <TopHeader onSearchPress={() => router.push("/search" as any)} onMenuPress={() => setMenuVisible(true)} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <WhatsOnYourMind />
        <StoriesBar />
        {visiblePosts.slice(0, 2).map((post) => (
          <FeedPost key={post.id} {...post} postId={post.id} userId={post.name.toLowerCase()} onClose={() => setHiddenPosts((prev) => [...prev, post.id])} />
        ))}
        <FriendSuggestions />
        {visiblePosts.slice(2).map((post) => (
          <FeedPost key={post.id} {...post} postId={post.id} userId={post.name.toLowerCase()} onClose={() => setHiddenPosts((prev) => [...prev, post.id])} />
        ))}
        <ReelsSection />
        {visiblePosts.slice(0, 2).map((post) => (
          <FeedPost key={`more-${post.id}`} {...post} postId={post.id} userId={post.name.toLowerCase()} time={`${post.time} ago`} onClose={() => setHiddenPosts((prev) => [...prev, post.id])} />
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>
      <ProfileSidebar visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </View>
  );
}