import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../theme/ThemeContext";

interface TopHeaderProps {
  onSearchPress?: () => void;
  onMenuPress?: () => void;
}

export default function TopHeader({ onSearchPress, onMenuPress }: TopHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
      <Text style={styles.logo}>facebook</Text>
      <View style={styles.right}>
        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.inputBg }]} activeOpacity={0.7}>
          <Image source={require("../../assets/icons/create.png")} style={{ width: 20, height: 20 }} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.inputBg }]} activeOpacity={0.7} onPress={onSearchPress}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.inputBg }]} activeOpacity={0.7} onPress={onMenuPress}>
          <Ionicons name="menu-outline" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#CED0D4",
  },
  logo: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1877F2",
    letterSpacing: -0.5,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E4E6EB",
    alignItems: "center",
    justifyContent: "center",
  },
});
