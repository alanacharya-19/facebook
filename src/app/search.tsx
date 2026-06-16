import { Ionicons } from "@expo/vector-icons";
import { useState, useMemo } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { useTheme } from "../theme/ThemeContext";
import { USERS } from "../data/users";
import Avatar from "../components/Avatar";

export default function SearchScreen() {
  const { colors } = useTheme();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return Object.values(USERS);
    const q = query.toLowerCase();
    return Object.values(USERS).filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.location.toLowerCase().includes(q) ||
        u.study.toLowerCase().includes(q)
    );
  }, [query]);

  const userIdFor = (name: string) =>
    Object.entries(USERS).find(([, v]) => v.name === name)?.[0] ?? "";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={[styles.searchWrap, { backgroundColor: colors.inputBg }]}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            placeholder="Search Facebook"
            placeholderTextColor={colors.textTertiary}
            style={[styles.input, { color: colors.text }]}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity activeOpacity={0.7} onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.name}
        ListHeaderComponent={
          !query.trim() ? <Text style={[styles.suggestionsLabel, { color: colors.textSecondary }]}>Suggestions</Text> : null
        }
        renderItem={({ item }) => {
          const uid = userIdFor(item.name);
          return (
            <TouchableOpacity
              style={styles.row}
              activeOpacity={0.7}
              onPress={() => {
                router.push(`/profile/${uid}` as any);
              }}
            >
              <Avatar uri={item.avatar} size={48} style={styles.avatar} />
              <View style={styles.info}>
                <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.detail, { color: colors.textSecondary }]}>
                  {item.location} · {item.study}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textSecondary }]}>No results found</Text>
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    gap: 12,
    borderBottomWidth: 0.5,
  },
  searchWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 36,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  list: {
    paddingTop: 4,
  },
  suggestionsLabel: {
    fontSize: 15,
    fontWeight: "700",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
  },
  detail: {
    fontSize: 13,
    marginTop: 2,
  },
  empty: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 40,
  },
});
