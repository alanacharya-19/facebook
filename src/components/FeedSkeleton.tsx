import { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

function Shimmer({ style }: { style?: any }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return <Animated.View style={[style, { opacity, backgroundColor: "#E4E6EB" }]} />;
}

function SkeletonBlock({ w, h, r = 6, style }: { w?: number | string; h: number; r?: number; style?: any }) {
  return <Shimmer style={[{ width: w ?? "100%", height: h, borderRadius: r }, style]} />;
}

function SkeletonCircle({ size }: { size: number }) {
  return <Shimmer style={{ width: size, height: size, borderRadius: size / 2 }} />;
}

export default function FeedSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SkeletonCircle size={36} />
        <SkeletonBlock w={200} h={36} r={18} />
        <SkeletonCircle size={36} />
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <SkeletonCircle size={40} />
          <SkeletonBlock w={180} h={40} r={20} />
          <SkeletonCircle size={40} />
        </View>
        <View style={[styles.row, { justifyContent: "space-around", marginTop: 12 }]}>
          <SkeletonBlock w={80} h={28} r={14} />
          <SkeletonBlock w={80} h={28} r={14} />
          <SkeletonBlock w={80} h={28} r={14} />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          {[1, 2, 3, 4].map((i) => (
            <SkeletonBlock key={i} w={100} h={160} r={14} />
          ))}
        </View>
      </View>

      {[1, 2].map((i) => (
        <View key={i} style={styles.section}>
          <View style={styles.row}>
            <SkeletonCircle size={40} />
            <View style={{ flex: 1 }}>
              <SkeletonBlock w={140} h={14} />
              <SkeletonBlock w={90} h={12} r={6} style={{ marginTop: 6 }} />
            </View>
          </View>
          <SkeletonBlock h={14} style={{ marginTop: 12 }} />
          <SkeletonBlock w="70%" h={14} style={{ marginTop: 6 }} />
          <SkeletonBlock h={200} style={{ marginTop: 12 }} />
          <View style={[styles.row, { justifyContent: "space-around", marginTop: 12 }]}>
            <SkeletonBlock w={60} h={14} />
            <SkeletonBlock w={60} h={14} />
            <SkeletonBlock w={60} h={14} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F2F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#CED0D4",
  },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    marginTop: 6,
    borderBottomWidth: 6,
    borderBottomColor: "#F0F2F5",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
