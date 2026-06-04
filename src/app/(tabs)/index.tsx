import { ScrollView, View } from "react-native";
import TopHeader from "../../components/TopHeader";
import WhatsOnYourMind from "../../components/WhatsOnYourMind";
import StoriesBar from "../../components/StoriesBar";
import FeedPost from "../../components/FeedPost";
import ReelsSection from "../../components/ReelsSection";

const POSTS = [
  { id: "1", name: "Alice", time: "2 hrs", content: "Had an amazing day at the beach!", avatarColor: "#1DA1F2" },
  { id: "2", name: "Bob", time: "4 hrs", content: "Just finished reading a great book. Highly recommend!", avatarColor: "#E1306C" },
  { id: "3", name: "Charlie", time: "6 hrs", content: "New recipe attempt tonight. Wish me luck!", avatarColor: "#00C853" },
];

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#F0F2F5" }}>
      <TopHeader />
      <ScrollView>
        <WhatsOnYourMind />
        <StoriesBar />
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
