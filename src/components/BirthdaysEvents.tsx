import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BirthdaysEvents() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.row} activeOpacity={0.7}>
        <View style={[styles.iconBg, { backgroundColor: "#E8F4FD" }]}>
          <Ionicons name="gift-outline" size={22} color="#1DA1F2" />
        </View>
        <View style={styles.textWrap}>
          <Text style={styles.text}>
            <Text style={styles.bold}>Alice</Text> and <Text style={styles.bold}>Bob</Text> have birthdays today.
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.row} activeOpacity={0.7}>
        <View style={[styles.iconBg, { backgroundColor: "#E7F3FF" }]}>
          <Ionicons name="calendar-outline" size={22} color="#1877F2" />
        </View>
        <View style={styles.textWrap}>
          <Text style={styles.text}>
            <Text style={styles.bold}>Community Meetup</Text> — Sat 7:00 PM
          </Text>
          <Text style={styles.meta}>3 friends going · 1 interested</Text>
        </View>
        <TouchableOpacity style={styles.dismissBtn} activeOpacity={0.7}>
          <Ionicons name="close-outline" size={18} color="#65676B" />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 6,
    borderBottomColor: "#F0F2F5",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: {
    flex: 1,
  },
  text: {
    fontSize: 14,
    color: "#050505",
    lineHeight: 19,
  },
  bold: {
    fontWeight: "600",
  },
  meta: {
    fontSize: 13,
    color: "#65676B",
    marginTop: 1,
  },
  divider: {
    height: 0.5,
    backgroundColor: "#CED0D4",
    marginVertical: 12,
  },
  dismissBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
