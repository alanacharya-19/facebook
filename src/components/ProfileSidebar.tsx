import { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MENU_ITEMS = [
  { icon: "settings-outline" as const, label: "Settings & privacy" },
  { icon: "shield-checkmark-outline" as const, label: "Security" },
  { icon: "lock-closed-outline" as const, label: "Privacy" },
  { icon: "person-outline" as const, label: "Account" },
  { icon: "moon-outline" as const, label: "Dark mode" },
  { icon: "help-circle-outline" as const, label: "Help & support" },
  { icon: "information-circle-outline" as const, label: "About" },
  { icon: "log-out-outline" as const, label: "Log Out", danger: true },
];

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function ProfileSidebar({ visible, onClose }: Props) {
  const slideAnim = useRef(new Animated.Value(-280)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: visible ? 0 : -280,
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
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
      </Animated.View>

      <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }], paddingTop: insets.top + 16 }]}>
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarTitle}>Menu</Text>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="#050505" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileRow}>
          <View style={styles.sidebarAvatar}>
            <Ionicons name="person" size={24} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sidebarName}>Alex Johnson</Text>
            <Text style={styles.sidebarSub}>See your profile</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {MENU_ITEMS.map((item) => (
          <TouchableOpacity key={item.label} style={styles.menuItem} activeOpacity={0.7}>
            <Ionicons name={item.icon} size={22} color={item.danger ? "#F02849" : "#050505"} />
            <Text style={[styles.menuLabel, item.danger && { color: "#F02849" }]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
}

const SIDEBAR_WIDTH = 280;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: SIDEBAR_WIDTH,
    height: "100%",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 2, height: 0 },
    shadowRadius: 12,
    elevation: 10,
  },
  sidebarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sidebarTitle: {
    fontSize: 22,
    fontWeight: "700",
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
    marginBottom: 16,
  },
  sidebarAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1877F2",
    alignItems: "center",
    justifyContent: "center",
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
  divider: {
    height: 0.5,
    backgroundColor: "#CED0D4",
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 12,
  },
  menuLabel: {
    fontSize: 14,
    color: "#050505",
  },
});
