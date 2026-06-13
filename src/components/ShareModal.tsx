import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ShareModal({ visible, onClose }: ShareModalProps) {
  const [shareText, setShareText] = useState("");

  const shareOptions = [
    { icon: "paper-plane-outline" as const, label: "Send in Messenger", color: "#1877F2" },
    { icon: "logo-whatsapp" as const, label: "Share on WhatsApp", color: "#25D366" },
    { icon: "link-outline" as const, label: "Copy Link", color: "#65676B" },
    { icon: "share-outline" as const, label: "Share via...", color: "#65676B" },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.writeSection}>
            <Text style={styles.writeTitle}>Write something...</Text>
            <TextInput
              placeholder='Say something about this post'
              placeholderTextColor="#8A8D91"
              style={styles.writeInput}
              value={shareText}
              onChangeText={setShareText}
              multiline
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.shareNowRow}>
            <TouchableOpacity style={styles.shareNowBtn} activeOpacity={0.7} onPress={() => { setShareText(""); onClose(); }}>
              <Ionicons name="send" size={20} color="#fff" />
              <Text style={styles.shareNowText}>Share Now</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <ScrollView style={styles.optionsList}>
            {shareOptions.map((opt) => (
              <TouchableOpacity key={opt.label} style={styles.optionRow} activeOpacity={0.7} onPress={() => { onClose(); }}>
                <View style={[styles.optionIcon, { backgroundColor: `${opt.color}15` }]}>
                  <Ionicons name={opt.icon} size={22} color={opt.color} />
                </View>
                <Text style={styles.optionLabel}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: "80%",
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#CED0D4",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 12,
  },
  writeSection: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  writeTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#050505",
    marginBottom: 8,
  },
  writeInput: {
    fontSize: 14,
    color: "#050505",
    backgroundColor: "#F0F2F5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 40,
    maxHeight: 80,
  },
  divider: {
    height: 6,
    backgroundColor: "#F0F2F5",
  },
  shareNowRow: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  shareNowBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#1877F2",
    borderRadius: 10,
    paddingVertical: 12,
  },
  shareNowText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
  optionsList: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 12,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#050505",
  },
});
