import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useRef } from "react";
import {
  Animated,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Avatar from "./Avatar";

type PostComposerProps = {
  visible: boolean;
  onClose: () => void;
};

const actions = [
  { icon: "images", label: "Photo", color: "#45BD62" },
  { icon: "videocam", label: "Video", color: "#F3425F" },
  { icon: "musical-notes", label: "Reel", color: "#F3425F" },
  { icon: "happy", label: "Feeling", color: "#F7B928" },
  { icon: "location", label: "Check in", color: "#1877F2" },
];

export default function PostComposer({ visible, onClose }: PostComposerProps) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");
  const [kbHeight, setKbHeight] = useState(0);
  const animatedKb = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardWillShow", (e) => {
      setKbHeight(e.endCoordinates.height);
      Animated.timing(animatedKb, {
        toValue: e.endCoordinates.height,
        duration: e.duration || 250,
        useNativeDriver: true,
      }).start();
    });
    const hideSub = Keyboard.addListener("keyboardWillHide", (e) => {
      setKbHeight(0);
      Animated.timing(animatedKb, {
        toValue: 0,
        duration: e.duration || 250,
        useNativeDriver: true,
      }).start();
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [animatedKb]);

  const handlePost = () => {
    setText("");
    Keyboard.dismiss();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { paddingBottom: insets.bottom }]}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <Ionicons name="close" size={24} color="#050505" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Post</Text>
          <TouchableOpacity
            style={[styles.postBtn, !text.trim() && styles.postBtnDisabled]}
            activeOpacity={0.7}
            disabled={!text.trim()}
            onPress={handlePost}
          >
            <Text style={[styles.postBtnText, !text.trim() && styles.postBtnTextDisabled]}>
              Post
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={[styles.body, { marginBottom: kbHeight }]} keyboardShouldPersistTaps="handled">
          <View style={styles.userRow}>
            <Avatar uri="https://i.pravatar.cc/150?u=alexj" size={40} />
            <View>
              <Text style={styles.userName}>Alex Johnson</Text>
              <View style={styles.privacyBadge}>
                <Ionicons name="people" size={12} color="#606770" />
                <Text style={styles.privacyText}>Friends</Text>
                <Ionicons name="chevron-down" size={10} color="#606770" />
              </View>
            </View>
          </View>

          <TextInput
            style={styles.textInput}
            placeholder="What's on your mind?"
            placeholderTextColor="#8A8D91"
            multiline
            value={text}
            onChangeText={setText}
            autoFocus
          />
        </ScrollView>

        <Animated.View style={[styles.bottomBar, { transform: [{ translateY: Animated.multiply(animatedKb, -1) }] }]}>
          <Text style={styles.bottomBarLabel}>Add to your post</Text>
          <View style={styles.bottomActions}>
            {actions.map((action) => (
              <TouchableOpacity key={action.label} style={styles.bottomActionBtn} activeOpacity={0.7}>
                <View style={[styles.bottomActionIcon, { backgroundColor: action.color }]}>
                  <Ionicons name={action.icon as any} size={18} color="#fff" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#CED0D4",
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E4E6EB",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#050505",
  },
  postBtn: {
    backgroundColor: "#1877F2",
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  postBtnDisabled: {
    backgroundColor: "#E4E6EB",
  },
  postBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  postBtnTextDisabled: {
    color: "#BCC0C4",
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 16,
    marginBottom: 8,
  },
  userName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#050505",
  },
  privacyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#E4E6EB",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 2,
    alignSelf: "flex-start",
  },
  privacyText: {
    fontSize: 12,
    color: "#606770",
  },
  textInput: {
    fontSize: 24,
    color: "#050505",
    lineHeight: 30,
    paddingTop: 8,
    paddingBottom: 20,
    minHeight: 160,
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: "#CED0D4",
  },
  bottomBarLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#65676B",
  },
  bottomActions: {
    flexDirection: "row",
    gap: 12,
  },
  bottomActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomActionIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});
