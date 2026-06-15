import { useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
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
import Avatar from "./Avatar";

interface SearchOverlayProps {
  onClose: () => void;
}

export default function SearchOverlay({ onClose }: SearchOverlayProps) {
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => { setQuery(""); onClose(); }}>
          <Ionicons name="arrow-back" size={24} color="#050505" />
        </TouchableOpacity>
        <View style={styles.wrap}>
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
        keyExtractor={(item) => item.name + Math.random()}
        ListHeaderComponent={
          !query.trim() ? <Text style={styles.suggestionsLabel}>Suggestions</Text> : null
        }
        renderItem={({ item }) => {
          const uid = Object.entries(USERS).find(([, v]) => v.name === item.name)?.[0] ?? "";
          return (
            <TouchableOpacity
              style={styles.row}
              activeOpacity={0.7}
              onPress={() => { setQuery(""); onClose(); router.push(`/profile/${uid}` as any); }}
            >
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.detail}>{item.location} · {item.study}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>No results found</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    zIndex: 9999,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 10,
    gap: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#CED0D4",
  },
  wrap: {
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
  suggestionsLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#65676B",
    paddingHorizontal: 16,
    paddingTop: 8,
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
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#050505",
  },
  detail: {
    fontSize: 12,
    color: "#65676B",
    marginTop: 1,
  },
  empty: {
    fontSize: 14,
    color: "#65676B",
    textAlign: "center",
    marginTop: 20,
  },
});
