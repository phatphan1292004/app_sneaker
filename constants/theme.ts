/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';


// Bảng màu chi tiết, chia nhóm, dễ mở rộng
export const PALETTE = {
  primary: '#0a7ea4',
  secondary: '#2ecc71',
  accent: '#e67e22',
  error: '#e74c3c',
  warning: '#f1c40f',
  success: '#27ae60',
  info: '#2980b9',
  backgroundLight: '#fff',
  backgroundDark: '#151718',
  surface: '#f5f6fa',
  textLight: '#11181C',
  textDark: '#ECEDEE',
  border: '#dfe4ea',
  iconLight: '#687076',
  iconDark: '#9BA1A6',
};

// Bảng màu cho light/dark mode, dùng PALETTE
export const Colors = {
  light: {
    primary: PALETTE.primary,
    secondary: PALETTE.secondary,
    accent: PALETTE.accent,
    error: PALETTE.error,
    warning: PALETTE.warning,
    success: PALETTE.success,
    info: PALETTE.info,
    text: PALETTE.textLight,
    background: PALETTE.backgroundLight,
    surface: PALETTE.surface,
    border: PALETTE.border,
    icon: PALETTE.iconLight,
    tabIconDefault: PALETTE.iconLight,
    tabIconSelected: PALETTE.primary,
  },
  dark: {
    primary: PALETTE.primary,
    secondary: PALETTE.secondary,
    accent: PALETTE.accent,
    error: PALETTE.error,
    warning: PALETTE.warning,
    success: PALETTE.success,
    info: PALETTE.info,
    text: PALETTE.textDark,
    background: PALETTE.backgroundDark,
    surface: PALETTE.backgroundDark,
    border: PALETTE.border,
    icon: PALETTE.iconDark,
    tabIconDefault: PALETTE.iconDark,
    tabIconSelected: '#fff',
  },
};

// Type cho màu, giúp gợi ý khi import
export type ThemeColors = typeof Colors.light;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
