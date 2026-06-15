import { useState, useCallback, useMemo } from "react";
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
import { POSTS, STORIES, FRIEND_SUGGESTIONS, REELS_COUNT } from "../../data/home";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const DEFAULT_REELS = Array.from({ length: REELS_COUNT }, (_, i) => ({
  id: String(i + 1),
  image: `https://picsum.photos/seed/reel${i + 1}/232/392`,
}));

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [hiddenPosts, setHiddenPosts] = useState<string[]>([]);
  const [seed, setSeed] = useState(0);

  const onRefresh = useCallback(() => {
    setHiddenPosts([]);
    setSeed((s) => s + 1);
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const visiblePosts = useMemo(() => shuffle(POSTS).filter((p) => !hiddenPosts.includes(p.id)), [seed, hiddenPosts]);
  const shuffledStories = useMemo(() => shuffle(STORIES), [seed]);
  const shuffledSuggestions = useMemo(() => shuffle(FRIEND_SUGGESTIONS), [seed]);
  const shuffledReels = useMemo(() => shuffle(DEFAULT_REELS), [seed]);

  return (
    <View style={{ flex: 1, backgroundColor: "#F0F2F5" }}>
      <TopHeader onSearchPress={() => router.push("/search" as any)} onMenuPress={() => setMenuVisible(true)} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <WhatsOnYourMind />
        <StoriesBar data={shuffledStories} />
        {visiblePosts.slice(0, 2).map((post) => (
          <FeedPost key={post.id} {...post} postId={post.id} userId={post.name.toLowerCase()} onClose={() => setHiddenPosts((prev) => [...prev, post.id])} />
        ))}
        <FriendSuggestions data={shuffledSuggestions} />
        {visiblePosts.slice(2).map((post) => (
          <FeedPost key={post.id} {...post} postId={post.id} userId={post.name.toLowerCase()} onClose={() => setHiddenPosts((prev) => [...prev, post.id])} />
        ))}
        <ReelsSection data={shuffledReels} />
        {visiblePosts.slice(0, 2).map((post) => (
          <FeedPost key={`more-${post.id}`} {...post} postId={post.id} userId={post.name.toLowerCase()} time={`${post.time} ago`} onClose={() => setHiddenPosts((prev) => [...prev, post.id])} />
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>
      <ProfileSidebar visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </View>
  );
}