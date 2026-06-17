import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../theme/ThemeContext";
import { FRIEND_SUGGESTIONS } from "../data/home";
import Avatar from "./Avatar";

type Props = {
  data?: typeof FRIEND_SUGGESTIONS;
};

export default function FriendSuggestions({ data }: Props) {
  const { colors } = useTheme();
  const items = data ?? FRIEND_SUGGESTIONS;
  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderBottomColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>People You May Know</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list}>
        {items.map((person) => (
          <View key={person.id} style={[styles.card, { borderColor: colors.border }]}>
            <TouchableOpacity onPress={() => router.push(`/profile/${person.name.toLowerCase()}` as any)} activeOpacity={0.7}>
              <Avatar uri={person.avatar} size={64} style={styles.avatar} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push(`/profile/${person.name.toLowerCase()}` as any)} activeOpacity={0.7}>
              <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{person.name}</Text>
            </TouchableOpacity>
            <Text style={[styles.mutual, { color: colors.textSecondary }]}>{person.mutual} mutual friends</Text>
            <TouchableOpacity style={[styles.addBtn, { backgroundColor: colors.primary }]} activeOpacity={0.7}>
              <Ionicons name="person-add" size={16} color="#fff" />
              <Text style={styles.addText}>Add Friend</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.removeBtn} activeOpacity={0.7}>
              <Text style={[styles.removeText, { color: colors.textSecondary }]}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "500",
  },
  list: {
    paddingHorizontal: 12,
    gap: 8,
  },
  card: {
    width: 132,
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    width: "100%",
  },
  mutual: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 10,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    width: "100%",
  },
  addText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  removeBtn: {
    alignItems: "center",
    paddingVertical: 6,
    width: "100%",
  },
  removeText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
