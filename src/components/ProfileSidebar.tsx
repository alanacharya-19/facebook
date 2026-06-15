import { useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Animated, StyleSheet, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SHORTCUTS = [
  { image: require("../../assets/icons/reel.png"), label: "Reels" },
  { image: require("../../assets/icons/feed.png"), label: "Feed" },
  { image: require("../../assets/icons/bookmark.png"), label: "Saved" },
  { image: require("../../assets/icons/friends.png"), label: "Friends" },
];

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function ProfileSidebar({ visible, onClose }: Props) {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: visible ? 0 : 300,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: visible ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 100 }]} pointerEvents="box-none">
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
      </Animated.View>

      <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }], paddingTop: insets.top }]}>
        <View style={styles.searchRow}>
          <View style={styles.searchInputWrap}>
            <Ionicons name="search" size={18} color="#65676B" />
            <TextInput placeholder="Search Facebook" placeholderTextColor="#8A8D91" style={styles.searchInput} />
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <TouchableOpacity style={styles.profileRow} activeOpacity={0.7} onPress={() => { onClose(); router.push("/profile" as any); }}>
            <Image source={{ uri: "https://i.pravatar.cc/150?u=alexj" }} style={styles.sidebarAvatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.sidebarName}>Alex Johnson</Text>
              <Text style={styles.sidebarSub}>See your profile</Text>
            </View>
            <Ionicons name="chevron-down" size={18} color="#65676B" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.createPageRow} activeOpacity={0.7}>
            <View style={styles.createPageIcon}>
              <Ionicons name="flag-outline" size={20} color="#050505" />
            </View>
            <Text style={styles.createPageText}>Create Facebook Page</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <Text style={styles.shortcutsHeader}>Your shortcuts</Text>
          {[SHORTCUTS.slice(0, 2), SHORTCUTS.slice(2)].map((row, ri) => (
            <View key={ri} style={styles.shortcutRow}>
              {row.map((s) => (
                <TouchableOpacity key={s.label} style={styles.shortcutItem} activeOpacity={0.7}>
                  <Image source={s.image} style={{ width: 28, height: 28 }} />
                  <Text style={styles.shortcutLabel}>{s.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}

          <TouchableOpacity style={styles.seeMoreRow} activeOpacity={0.7}>
            <View style={styles.seeMoreIcon}>
              <Ionicons name="chevron-down" size={18} color="#050505" />
            </View>
            <Text style={styles.seeMoreText}>See more</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
            <View style={styles.optionIcon}>
              <Ionicons name="help-circle-outline" size={22} color="#050505" />
            </View>
            <Text style={styles.optionLabel}>Help & support</Text>
            <Ionicons name="chevron-down" size={18} color="#65676B" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
            <View style={styles.optionIcon}>
              <Ionicons name="settings-outline" size={22} color="#050505" />
            </View>
            <Text style={styles.optionLabel}>Settings & privacy</Text>
            <Ionicons name="chevron-down" size={18} color="#65676B" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.logoutRow} activeOpacity={0.7}>
            <View style={[styles.optionIcon, { backgroundColor: "#FEEBEE" }]}>
              <Ionicons name="log-out-outline" size={20} color="#F02849" />
            </View>
            <Text style={[styles.optionLabel, { color: "#F02849" }]}>Logout</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sidebar: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 300,
    height: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: -2, height: 0 },
    shadowRadius: 12,
    elevation: 10,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
    marginBottom: 16,
  },
  searchInputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F2F5",
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 36,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#050505",
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E4E6EB",
    alignItems: "center",
    justifyContent: "center",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  sidebarAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  sidebarName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#050505",
  },
  sidebarSub: {
    fontSize: 12,
    color: "#65676B",
    marginTop: 1,
  },
  createPageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  createPageIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E4E6EB",
    alignItems: "center",
    justifyContent: "center",
  },
  createPageText: {
    fontSize: 14,
    color: "#050505",
  },
  divider: {
    height: 0.5,
    backgroundColor: "#CED0D4",
    marginVertical: 6,
  },
  shortcutsHeader: {
    fontSize: 15,
    fontWeight: "700",
    color: "#65676B",
    marginBottom: 8,
    marginTop: 4,
  },
  shortcutRow: {
    flexDirection: "row",
    gap: 4,
  },
  shortcutItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    paddingVertical: 8,
  },
  shortcutIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E4E6EB",
    alignItems: "center",
    justifyContent: "center",
  },
  shortcutLabel: {
    fontSize: 14,
    color: "#050505",
  },
  seeMoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    marginTop: 2,
  },
  seeMoreIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E4E6EB",
    alignItems: "center",
    justifyContent: "center",
  },
  seeMoreText: {
    fontSize: 14,
    color: "#050505",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E4E6EB",
    alignItems: "center",
    justifyContent: "center",
  },
  optionLabel: {
    flex: 1,
    fontSize: 14,
    color: "#050505",
  },
  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
});
