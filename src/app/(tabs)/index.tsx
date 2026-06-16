import { useState, useCallback, useEffect, useMemo, useRef } from "react";
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
import PostComposer from "../../components/PostComposer";
import PostUploadProgress from "../../components/PostUploadProgress";
import { POSTS, STORIES, FRIEND_SUGGESTIONS, REELS_COUNT } from "../../data/home";
import { USERS } from "../../data/users";
import { useTheme } from "../../theme/ThemeContext";

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
  const { colors, isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [hiddenPosts, setHiddenPosts] = useState<string[]>([]);
  const [composerVisible, setComposerVisible] = useState(false);
  const [pickerOnOpen, setPickerOnOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [seed, setSeed] = useState(0);

  const uploadTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    return () => { if (uploadTimerRef.current) clearInterval(uploadTimerRef.current); };
  }, []);

  const handlePost = (text: string, photos: string[]) => {
    if (uploading) return;
    setUploadProgress(0);
    setUploading(true);
    let pct = 0;
    uploadTimerRef.current = setInterval(() => {
      pct += Math.random() * 8 + 2;
      if (pct >= 100) {
        pct = 100;
        if (uploadTimerRef.current) clearInterval(uploadTimerRef.current);
        const currentUser = Object.values(USERS)[0];
        const newPost = {
          id: `user-${Date.now()}`,
          name: currentUser.name,
          time: "Just now",
          content: text,
          avatar: currentUser.avatar,
          photo: photos.length > 0 ? photos[0] : undefined,
          photos: photos.length > 0 ? photos : undefined,
        };
        setUserPosts((prev) => [newPost, ...prev]);
        setTimeout(() => setUploading(false), 600);
      }
      setUploadProgress(Math.round(pct));
    }, 200);
  };

  const onRefresh = useCallback(() => {
    setHiddenPosts([]);
    setUserPosts([]);
    setHiddenPosts([]);
    setSeed((s) => s + 1);
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const visiblePosts = useMemo(() => [...userPosts, ...shuffle(POSTS).filter((p) => !hiddenPosts.includes(p.id))], [seed, hiddenPosts, userPosts]);
  const shuffledStories = useMemo(() => {
    const self = STORIES.find((s) => s.isSelf);
    const others = shuffle(STORIES.filter((s) => !s.isSelf));
    return self ? [self, ...others] : others;
  }, [seed]);
  const shuffledSuggestions = useMemo(() => shuffle(FRIEND_SUGGESTIONS), [seed]);
  const shuffledReels = useMemo(() => shuffle(DEFAULT_REELS), [seed]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopHeader onSearchPress={() => router.push("/search" as any)} onMenuPress={() => setMenuVisible(true)} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <WhatsOnYourMind onPress={() => { setPickerOnOpen(false); setComposerVisible(true); }} onCameraPress={() => { setPickerOnOpen(true); setComposerVisible(true); }} />
        <StoriesBar data={shuffledStories} />
        {uploading && <PostUploadProgress progress={uploadProgress} />}
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
      <PostComposer visible={composerVisible} onClose={() => { setComposerVisible(false); setPickerOnOpen(false); }} openPicker={pickerOnOpen} onPost={handlePost} />
    </View>
  );
}