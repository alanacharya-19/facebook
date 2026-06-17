import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useRef } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
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
import * as ImagePicker from "expo-image-picker";
import Avatar from "./Avatar";
import { useTheme } from "../theme/ThemeContext";

type PostComposerProps = {
  visible: boolean;
  onClose: () => void;
  openPicker?: boolean;
  onPost?: (text: string, photos: string[]) => void;
};

const actions = [
  { icon: "images", label: "Photo", color: "#45BD62" },
  { icon: "videocam", label: "Video", color: "#F3425F" },
  { icon: "musical-notes", label: "Reel", color: "#F3425F" },
  { icon: "happy", label: "Feeling", color: "#F7B928" },
  { icon: "location", label: "Check in", color: "#1877F2" },
];

function PhotoGrid({ photos, onAdd, colors }: { photos: string[]; onAdd: () => void; colors: any }) {
  const count = photos.length;
  if (count === 0) return null;

  const renderImage = (uri: string, index: number, style: any) => (
    <Image key={index} source={{ uri }} style={[style, { resizeMode: "cover" }]} />
  );

  if (count === 1) {
    return (
      <View style={styles.grid1}>
        {renderImage(photos[0], 0, styles.gridImg1)}
      </View>
    );
  }

  if (count === 2) {
    return (
      <View style={styles.grid2}>
        {renderImage(photos[0], 0, styles.gridImgHalf)}
        {renderImage(photos[1], 1, styles.gridImgHalf)}
      </View>
    );
  }

  if (count === 3) {
    return (
      <View style={styles.grid3}>
        <View style={styles.grid3Left}>
          {renderImage(photos[0], 0, styles.gridImgFull)}
        </View>
        <View style={styles.grid3Right}>
          {renderImage(photos[1], 1, styles.gridImgQuad)}
          {renderImage(photos[2], 2, styles.gridImgQuad)}
        </View>
      </View>
    );
  }

  if (count === 4) {
    return (
      <View style={styles.grid4}>
        <View style={styles.gridRow}>
          {renderImage(photos[0], 0, styles.gridImgQuad)}
          {renderImage(photos[1], 1, styles.gridImgQuad)}
        </View>
        <View style={styles.gridRow}>
          {renderImage(photos[2], 2, styles.gridImgQuad)}
          {renderImage(photos[3], 3, styles.gridImgQuad)}
        </View>
      </View>
    );
  }

  const maxVisible = count >= 6 ? 6 : 5;
  const visible = photos.slice(0, maxVisible);
  const remaining = count - maxVisible;

  const rows = [
    visible.slice(0, 3),
    visible.slice(3, maxVisible),
  ];

  return (
    <View style={styles.grid6}>
      {rows.map((row, ri) => (
        <View key={ri} style={styles.gridRow}>
          {row.map((uri, ci) => {
            const idx = ri * 3 + ci;
            const isLast = idx === maxVisible - 1;
            return (
              <View key={idx} style={styles.gridImgThird}>
                {renderImage(uri, idx, styles.gridImgFull)}
                {isLast && remaining > 0 && (
                  <View style={styles.gridOverlay}>
                    <Text style={styles.gridOverlayText}>+{remaining}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      ))}
      <TouchableOpacity style={[styles.gridAddBtn, { borderColor: colors.border }]} activeOpacity={0.7} onPress={onAdd}>
        <Ionicons name="images" size={20} color={colors.primary} />
        <Text style={[styles.gridAddText, { color: colors.primary }]}>Add more</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function PostComposer({ visible, onClose, openPicker, onPost }: PostComposerProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const [text, setText] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const pickerStarted = useRef(false);

  useEffect(() => {
    if (visible && openPicker && !pickerStarted.current) {
      pickerStarted.current = true;
      pickImages();
    }
    if (!visible) {
      pickerStarted.current = false;
    }
  }, [visible, openPicker]);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: 10,
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      setPhotos(result.assets.map((a) => a.uri));
    }
    Keyboard.dismiss();
  };

  const handlePost = () => {
    onPost?.(text, photos);
    setText("");
    setPhotos([]);
    Keyboard.dismiss();
    onClose();
  };

  const handleClose = () => {
    setText("");
    setPhotos([]);
    Keyboard.dismiss();
    onClose();
  };

  const disabled = !text.trim() && photos.length === 0;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <Pressable style={styles.backdrop} onPress={handleClose} />
      <View style={[styles.sheet, { backgroundColor: colors.card, paddingBottom: insets.bottom }]}>
        <View style={[styles.header, { backgroundColor: colors.card, paddingTop: insets.top + 8, borderBottomColor: colors.border }]}>
          <TouchableOpacity style={[styles.closeBtn, { backgroundColor: colors.inputBg }]} onPress={handleClose} activeOpacity={0.7}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Create Post</Text>
          <TouchableOpacity
            style={[styles.postBtn, { backgroundColor: disabled ? colors.cardSecondary : colors.primary }]}
            activeOpacity={0.7}
            disabled={disabled}
            onPress={handlePost}
          >
            <Text style={[styles.postBtnText, { color: disabled ? colors.textTertiary : colors.white }]}>
              Post
            </Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView style={styles.bodyWrap} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}>
          <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
            <View style={styles.userRow}>
              <Avatar uri="https://i.pravatar.cc/150?u=alexj" size={40} />
              <View>
                <Text style={[styles.userName, { color: colors.text }]}>Alex Johnson</Text>
                <View style={[styles.privacyBadge, { backgroundColor: colors.inputBg }]}>
                  <Ionicons name="people" size={12} color={colors.textSecondary} />
                  <Text style={[styles.privacyText, { color: colors.textSecondary }]}>Friends</Text>
                  <Ionicons name="chevron-down" size={10} color={colors.textSecondary} />
                </View>
              </View>
            </View>

            <TextInput
              style={[styles.textInput, { color: colors.text }]}
              placeholder="What's on your mind?"
              placeholderTextColor={colors.textTertiary}
              multiline
              value={text}
              onChangeText={setText}
              autoFocus
            />

            <PhotoGrid photos={photos} onAdd={pickImages} colors={colors} />
            <View style={{ height: 56 }} />
          </ScrollView>

          <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
            <Text style={[styles.bottomBarLabel, { color: colors.textSecondary }]}>Add to your post</Text>
            <View style={styles.bottomActions}>
              {actions.map((action) => (
                <TouchableOpacity
                  key={action.label}
                  style={[styles.bottomActionBtn, { backgroundColor: colors.cardSecondary }]}
                  activeOpacity={0.7}
                  onPress={action.label === "Photo" ? pickImages : undefined}
                >
                  <View style={[styles.bottomActionIcon, { backgroundColor: action.color }]}>
                    <Ionicons name={action.icon as any} size={18} color="#fff" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </KeyboardAvoidingView>
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  postBtn: {
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  postBtnText: {
    fontSize: 14,
    fontWeight: "700",
  },
  bodyWrap: {
    flex: 1,
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
  },
  privacyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 2,
    alignSelf: "flex-start",
  },
  privacyText: {
    fontSize: 12,
  },
  textInput: {
    fontSize: 24,
    lineHeight: 30,
    paddingTop: 8,
    paddingBottom: 20,
    minHeight: 120,
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 0.5,
  },
  bottomBarLabel: {
    fontSize: 14,
    fontWeight: "600",
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
  grid1: {
    width: "100%",
    height: 260,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
  },
  gridImg1: {
    width: "100%",
    height: "100%",
  },
  grid2: {
    flexDirection: "row",
    gap: 3,
    height: 260,
    marginBottom: 12,
  },
  gridImgHalf: {
    flex: 1,
    borderRadius: 8,
  },
  grid3: {
    flexDirection: "row",
    gap: 3,
    height: 260,
    marginBottom: 12,
  },
  grid3Left: {
    flex: 1,
  },
  grid3Right: {
    flex: 1,
    gap: 3,
  },
  gridImgFull: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  gridImgQuad: {
    flex: 1,
    borderRadius: 8,
  },
  grid4: {
    gap: 3,
    height: 260,
    marginBottom: 12,
  },
  gridRow: {
    flexDirection: "row",
    gap: 3,
    flex: 1,
  },
  grid6: {
    gap: 3,
    marginBottom: 12,
  },
  gridImgThird: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  gridOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  gridOverlayText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  gridAddBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    marginTop: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  gridAddText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
