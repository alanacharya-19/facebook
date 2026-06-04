import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ACTION_BUTTONS = [
  { icon: "videocam" as const, label: "Live", color: "#F02849" },
  { icon: "images" as const, label: "Photo", color: "#45BD62" },
  { icon: "happy-outline" as const, label: "Feeling", color: "#F7B928" },
];

export default function WhatsOnYourMind() {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={22} color="#fff" />
        </View>
        <TouchableOpacity style={styles.inputButton} activeOpacity={0.7}>
          <Text style={styles.inputText}>What's on your mind?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cameraBtn} activeOpacity={0.7}>
          <Ionicons name="camera-outline" size={22} color="#050505" />
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
      <View style={styles.actionsRow}>
        {ACTION_BUTTONS.map((btn) => (
          <TouchableOpacity key={btn.label} style={styles.actionButton} activeOpacity={0.6}>
            <View style={[styles.iconBg, { backgroundColor: btn.color }]}>
              <Ionicons name={btn.icon} size={16} color="#fff" />
            </View>
            <Text style={styles.actionLabel}>{btn.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
    borderBottomWidth: 6,
    borderBottomColor: "#F0F2F5",
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
    backgroundColor: "#1877F2",
    alignItems: "center",
    justifyContent: "center",
  },
  inputButton: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F2F5",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  inputText: {
    fontSize: 15,
    color: "#65676B",
  },
  cameraBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
