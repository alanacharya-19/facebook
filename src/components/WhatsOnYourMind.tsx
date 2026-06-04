import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ACTION_BUTTONS = [
  { icon: "videocam" as const, label: "Live", color: "#F3425F" },
  { icon: "images" as const, label: "Photo", color: "#45BD62" },
  { icon: "location-outline" as const, label: "Check in", color: "#1877F2" },
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
      </View>
      <View style={styles.divider} />
      <View style={styles.actionsRow}>
        {ACTION_BUTTONS.map((btn) => (
          <TouchableOpacity key={btn.label} style={styles.actionButton} activeOpacity={0.6}>
            <Ionicons name={btn.icon} size={20} color={btn.color} />
            <Text style={[styles.actionLabel, { color: btn.color }]}>{btn.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
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
    borderWidth: 1,
    borderColor: "#DEDEDE",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  inputText: {
    fontSize: 15,
    color: "#8A8D91",
  },
  divider: {
    height: 0.5,
    backgroundColor: "#DEDEDE",
    marginVertical: 10,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
});
