import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

type TabName = "index" | "videos" | "friends" | "messages" | "notifications";

const TAB_ICONS: Record<
  TabName,
  {
    focused: keyof typeof Ionicons.glyphMap;
    unfocused: keyof typeof Ionicons.glyphMap;
  }
> = {
  index: { focused: "home", unfocused: "home-outline" },
  videos: { focused: "film", unfocused: "film-outline" },
  messages: { focused: "chatbubbles", unfocused: "chatbubbles-outline" },
  friends: { focused: "people", unfocused: "people-outline" },
  notifications: {
    focused: "notifications",
    unfocused: "notifications-outline",
  },
};

function CustomTabBar(props: {
  navigation: any;
  state: { routes: { key: string; name: string }[]; index: number };
  descriptors: Record<string, { options: Record<string, any> }>;
  insets: { top: number; bottom: number; left: number; right: number };
}) {
  const { navigation, state, descriptors, insets } = props;
  const { width: screenWidth } = useWindowDimensions();
  const tabWidth = screenWidth / state.routes.length;
  const LINE_WIDTH = 50;
  const tabPositionX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(tabPositionX, {
      toValue: state.index * tabWidth + (tabWidth - LINE_WIDTH) / 2,
      useNativeDriver: true,
      tension: 100,
      friction: 10,
    }).start();
  }, [state.index, tabWidth]);

  return (
    <View style={[styles.tabBar, { paddingBottom: 8 + insets.bottom }]}>
      <Animated.View
        style={[
          styles.indicator,
          {
            width: LINE_WIDTH,
            transform: [{ translateX: tabPositionX }],
          },
        ]}
      />
      <View style={styles.tabsContainer}>
        {state.routes.map(
          (route: { key: string; name: string }, index: number) => {
            const isFocused = state.index === index;
            const tabName = route.name as TabName;
            const iconConfig = TAB_ICONS[tabName];
            const iconName =
              iconConfig?.[isFocused ? "focused" : "unfocused"] ?? "ellipse";

            const { options } = descriptors[route.key];

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: "tabLongPress",
                target: route.key,
              });
            };

            return (
              <TouchableOpacity
                key={route.key}
                activeOpacity={0.7}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tab}
                accessibilityRole="tab"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
              >
                <Ionicons
                  name={iconName}
                  size={24}
                  color={isFocused ? "#1877F2" : "#8A8D91"}
                />
              </TouchableOpacity>
            );
          },
        )}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="videos" />
      <Tabs.Screen name="messages" />
      <Tabs.Screen name="friends" />
      <Tabs.Screen name="notifications" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 0.5,
    borderTopColor: "#DEDEDE",
    paddingTop: 0,
  },
  indicator: {
    height: 3,
    backgroundColor: "#1877F2",
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingTop: 8,
    paddingBottom: 8,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
