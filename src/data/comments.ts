export interface Comment {
  id: string;
  name: string;
  avatar: string;
  time: string;
  text: string;
  likes: number;
  liked: boolean;
  replies?: number;
}

export const POST_COMMENTS: Record<string, Comment[]> = {
  "1": [
    { id: "c1", name: "Charlie", avatar: "https://i.pravatar.cc/150?u=charlie", time: "1 hr", text: "Looks amazing! Where is this beach?", likes: 12, liked: false, replies: 3 },
    { id: "c2", name: "Diana", avatar: "https://i.pravatar.cc/150?u=diana", time: "45 min", text: "So jealous! 😍", likes: 8, liked: false, replies: 1 },
    { id: "c3", name: "Eve", avatar: "https://i.pravatar.cc/150?u=eve", time: "30 min", text: "The sunset in the background is incredible!", likes: 5, liked: true },
    { id: "c4", name: "Frank", avatar: "https://i.pravatar.cc/150?u=frank", time: "15 min", text: "We should go here next weekend!", likes: 3, liked: false },
  ],
  "2": [
    { id: "c5", name: "Alice", avatar: "https://i.pravatar.cc/150?u=alice", time: "3 hrs", text: "What book was it?", likes: 10, liked: false, replies: 2 },
    { id: "c6", name: "Diana", avatar: "https://i.pravatar.cc/150?u=diana", time: "2 hrs", text: "Adding this to my reading list!", likes: 7, liked: true },
  ],
  "3": [
    { id: "c7", name: "Bob", avatar: "https://i.pravatar.cc/150?u=bob", time: "5 hrs", text: "Can't wait to see how it turned out!", likes: 6, liked: false, replies: 1 },
    { id: "c8", name: "Alice", avatar: "https://i.pravatar.cc/150?u=alice", time: "4 hrs", text: "Share the recipe please! 🙏", likes: 15, liked: false },
    { id: "c9", name: "Eve", avatar: "https://i.pravatar.cc/150?u=eve", time: "3 hrs", text: "Cooking is the best therapy!", likes: 4, liked: true, replies: 2 },
  ],
};
