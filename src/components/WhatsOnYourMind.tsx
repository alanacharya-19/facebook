import { Ionicons } from "@expo/vector-icons";
import { Image, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useTheme } from "../theme/ThemeContext";
import Avatar from "./Avatar";

type Props = {
  onPress?: () => void;
  onCameraPress?: () => void;
};

export default function WhatsOnYourMind({ onPress, onCameraPress }: Props) {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderBottomColor: colors.background }]}>
      <View style={styles.topRow}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.push("/profile" as any)}>
          <Avatar uri="https://i.pravatar.cc/150?u=alexj" size={40} style={styles.avatar} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.inputButton, { backgroundColor: colors.inputBg }]} activeOpacity={0.7} onPress={onPress}>
          <Text style={[styles.inputText, { color: colors.textSecondary }]}>What's on your mind?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cameraBtn} activeOpacity={0.7} onPress={onCameraPress}>
          <View style={[styles.cameraIconBg, { backgroundColor: colors.success }]}>
            <Ionicons name="images" size={16} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
    borderBottomWidth: 6,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  inputButton: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  inputText: {
    fontSize: 15,
  },
  cameraBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraIconBg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: 0.5,
    backgroundColor: "#CED0D4",
    marginVertical: 10,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 4,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  iconBg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#65676B",
  },
});
