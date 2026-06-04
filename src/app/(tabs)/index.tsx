import { useState, useCallback } from "react";
import { ScrollView, View, RefreshControl } from "react-native";
import TopHeader from "../../components/TopHeader";
import WhatsOnYourMind from "../../components/WhatsOnYourMind";
import StoriesBar from "../../components/StoriesBar";
import FriendSuggestions from "../../components/FriendSuggestions";
import BirthdaysEvents from "../../components/BirthdaysEvents";
import Memories from "../../components/Memories";
import RoomsGroups from "../../components/RoomsGroups";
import FeedPost from "../../components/FeedPost";
import ReelsSection from "../../components/ReelsSection";
import FeedSkeleton from "../../components/FeedSkeleton";

const POSTS = [
  { id: "1", name: "Alice", time: "2 hrs", content: "Had an amazing day at the beach!", avatarColor: "#1DA1F2" },
  { id: "2", name: "Bob", time: "4 hrs", content: "Just finished reading a great book. Highly recommend!", avatarColor: "#E1306C" },
  { id: "3", name: "Charlie", time: "6 hrs", content: "New recipe attempt tonight. Wish me luck!", avatarColor: "#00C853" },
];

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  if (!loaded) {
    return (
      <View style={{ flex: 1, backgroundColor: "#F0F2F5" }}>
        <TopHeader />
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <FeedSkeleton />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F0F2F5" }}>
      <TopHeader />
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <WhatsOnYourMind />
        <StoriesBar />
        <FriendSuggestions />
        <BirthdaysEvents />
        <Memories />
        <RoomsGroups />
        {POSTS.map((post) => (
          <FeedPost key={post.id} {...post} />
        ))}
        <ReelsSection />
        {POSTS.slice(0, 2).map((post) => (
          <FeedPost key={`more-${post.id}`} {...post} time={`${post.time} ago`} />
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}