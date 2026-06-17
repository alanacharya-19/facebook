import { useState } from "react";
import { Image, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  uri?: string | null;
  size: number;
  style?: any;
};

export default function Avatar({ uri, size, style }: Props) {
  const [failed, setFailed] = useState(false);

  if (!uri || failed) {
    return (
      <View style={[styles.fallback, { width: size, height: size, borderRadius: size / 2 }, style]}>
        <Ionicons name="person" size={size * 0.55} color="#fff" />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={[{ width: size, height: size, borderRadius: size / 2 }, style]}
      onError={() => setFailed(true)}
    />
  );
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: "#BCC0C4",
    alignItems: "center",
    justifyContent: "center",
  },
});
