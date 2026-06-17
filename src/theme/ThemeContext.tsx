import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useColorScheme, StatusBar } from "react-native";

export type ThemeColors = {
  background: string;
  card: string;
  cardSecondary: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  borderLight: string;
  inputBg: string;
  primary: string;
  primaryLight: string;
  danger: string;
  success: string;
  warning: string;
  overlay: string;
  white: string;
  dark: string;
  isDark: boolean;
};

const light: ThemeColors = {
  background: "#F0F2F5",
  card: "#FFFFFF",
  cardSecondary: "#F0F2F5",
  text: "#050505",
  textSecondary: "#65676B",
  textTertiary: "#8A8D91",
  border: "#CED0D4",
  borderLight: "#E4E6EB",
  inputBg: "#F0F2F5",
  primary: "#1877F2",
  primaryLight: "#E7F3FF",
  danger: "#F02849",
  success: "#45BD62",
  warning: "#F7B928",
  overlay: "rgba(0,0,0,0.4)",
  white: "#FFFFFF",
  dark: "#000000",
  isDark: false,
};

const dark: ThemeColors = {
  background: "#18191A",
  card: "#242526",
  cardSecondary: "#3A3B3C",
  text: "#E4E6EB",
  textSecondary: "#B0B3B8",
  textTertiary: "#8A8D91",
  border: "#3E4042",
  borderLight: "#3E4042",
  inputBg: "#3A3B3C",
  primary: "#2D88FF",
  primaryLight: "#2D88FF33",
  danger: "#F02849",
  success: "#45BD62",
  warning: "#F7B928",
  overlay: "rgba(0,0,0,0.6)",
  white: "#FFFFFF",
  dark: "#000000",
  isDark: true,
};

type ThemeContextType = {
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
  setDark: (v: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  colors: light,
  isDark: false,
  toggleTheme: () => {},
  setDark: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === "dark");

  useEffect(() => {
    setIsDark(systemScheme === "dark");
  }, [systemScheme]);

  const toggleTheme = () => setIsDark((p) => !p);
  const setDark = (v: boolean) => setIsDark(v);

  return (
    <ThemeContext.Provider value={{ colors: isDark ? dark : light, isDark, toggleTheme, setDark }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
