import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme/ThemeContext";

type Props = {
  progress: number;
};

export default function PostUploadProgress({ progress }: Props) {
  const { colors } = useTheme();
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (progress < 100) {
      const loop = Animated.loop(
        Animated.timing(spin, {
          toValue: 1,
          duration: 800,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      );
      loop.start();
      return () => loop.stop();
    }
  }, [progress]);

  const spinDeg = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const done = progress >= 100;

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderBottomColor: colors.background }]}>
      <View style={styles.left}>
        <View style={[styles.dot, { backgroundColor: colors.primary }, done && { backgroundColor: colors.success }]} />
        <Text style={[styles.label, { color: colors.text }, done && { color: colors.success }]}>
          {done ? "Post uploaded" : "Your post"}
        </Text>
      </View>
      <View style={styles.right}>
        <View style={[styles.ring, { borderColor: colors.borderLight }, done && { borderColor: colors.success }]}>
          <Animated.View
            style={[
              styles.spinner,
              { borderColor: colors.primary, borderTopColor: "transparent" },
              !done && { transform: [{ rotate: spinDeg }] },
              done && { opacity: 0 },
            ]}
          />
          {done && <Text style={[styles.check, { color: colors.success }]}>✓</Text>}
        </View>
        {!done && <Text style={[styles.pct, { color: colors.textSecondary }]}>{Math.round(progress)}%</Text>}
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
    paddingVertical: 10,
    borderBottomWidth: 6,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ring: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  ringDone: {},
  spinner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  check: {
    fontSize: 16,
    fontWeight: "700",
  },
  pct: {
    fontSize: 12,
    fontWeight: "600",
    minWidth: 30,
  },
});
