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
import { USERS } from "../data/users";
import Avatar from "../components/Avatar";

export default function SearchScreen() {
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#050505" />
        </TouchableOpacity>
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color="#65676B" />
          <TextInput
            placeholder="Search Facebook"
            placeholderTextColor="#8A8D91"
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity activeOpacity={0.7} onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={18} color="#65676B" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.name}
        ListHeaderComponent={
          !query.trim() ? <Text style={styles.suggestionsLabel}>Suggestions</Text> : null
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
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.detail}>
                  {item.location} · {item.study}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.empty}>No results found</Text>
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    gap: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#CED0D4",
  },
  searchWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F2F5",
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 36,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#050505",
  },
  list: {
    paddingTop: 4,
  },
  suggestionsLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#65676B",
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
    color: "#050505",
  },
  detail: {
    fontSize: 13,
    color: "#65676B",
    marginTop: 2,
  },
  empty: {
    fontSize: 14,
    color: "#65676B",
    textAlign: "center",
    marginTop: 40,
  },
});
