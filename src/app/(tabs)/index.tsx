import { useState, useCallback } from "react";
import { ScrollView, View, RefreshControl } from "react-native";
import TopHeader from "../../components/TopHeader";
import WhatsOnYourMind from "../../components/WhatsOnYourMind";
import StoriesBar from "../../components/StoriesBar";
import FriendSuggestions from "../../components/FriendSuggestions";
import FeedPost from "../../components/FeedPost";
import ReelsSection from "../../components/ReelsSection";
import FeedSkeleton from "../../components/FeedSkeleton";
import { POSTS } from "../../data/home";

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#F0F2F5" }}>
      <TopHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <WhatsOnYourMind />
        <StoriesBar />
        {POSTS.slice(0, 2).map((post) => (
          <FeedPost key={post.id} {...post} userId={post.name.toLowerCase()} />
        ))}
        <FriendSuggestions />
        {POSTS.slice(2).map((post) => (
          <FeedPost key={post.id} {...post} userId={post.name.toLowerCase()} />
        ))}
        <ReelsSection />
        {POSTS.slice(0, 2).map((post) => (
          <FeedPost key={`more-${post.id}`} {...post} userId={post.name.toLowerCase()} time={`${post.time} ago`} />
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}