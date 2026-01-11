import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { t, useAdminTheme } from "./theme";

export function ScreenPro({
  title,
  subtitle,
  children,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { mode } = useAdminTheme();
  return (
    <View className={t(mode, "flex-1 bg-white", "flex-1 bg-black")}>
      <TopBar title={title} subtitle={subtitle} right={right} />
      <View className="flex-1">{children}</View>
    </View>
  );
}

export function TopBar({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  const { mode, toggle } = useAdminTheme();
  const navigation = useNavigation();

  return (
    <View
      className={t(
        mode,
        "px-5 pt-5 pb-6 border-b border-gray-200 bg-white",
        "px-5 pt-5 pb-6 border-b border-gray-900 bg-black"
      )}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1 pr-3">
          <Pressable
            onPress={() => (navigation as any).openDrawer?.()}
            className={t(
              mode,
              "w-11 h-11 rounded-2xl bg-gray-100 items-center justify-center mr-3",
              "w-11 h-11 rounded-2xl bg-gray-900 items-center justify-center mr-3"
            )}
          >
            <Ionicons
              name="menu"
              size={20}
              color={mode === "dark" ? "#fff" : "#111827"}
            />
          </Pressable>

          <View className="flex-1">
            <Text
              className={t(
                mode,
                "text-2xl font-extrabold text-gray-900",
                "text-2xl font-extrabold text-white"
              )}
              numberOfLines={1}
            >
              {title}
            </Text>
            {!!subtitle && (
              <Text
                className={t(
                  mode,
                  "text-gray-500 mt-0.5",
                  "text-gray-400 mt-0.5"
                )}
                numberOfLines={1}
              >
                {subtitle}
              </Text>
            )}
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          {right}
          <Pressable
            onPress={toggle}
            className={t(
              mode,
              "w-11 h-11 rounded-2xl bg-gray-100 items-center justify-center",
              "w-11 h-11 rounded-2xl bg-gray-900 items-center justify-center"
            )}
          >
            <Ionicons
              name={mode === "dark" ? "sunny-outline" : "moon"}
              size={18}
              color={mode === "dark" ? "#fff" : "#111827"}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export function CardPro({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { mode } = useAdminTheme();
  return (
    <View
      className={
        t(
          mode,
          "bg-white border border-gray-200",
          "bg-black border border-gray-900"
        ) +
        " rounded-2xl p-4 shadow-sm " +
        className
      }
    >
      {children}
    </View>
  );
}

export function Row({
  left,
  right,
  className = "",
}: {
  left: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <View className={"flex-row items-center justify-between " + className}>
      <View className="flex-1 pr-3">{left}</View>
      {!!right && <View>{right}</View>}
    </View>
  );
}

export function SearchBox({
  value,
  onChange,
  placeholder = "Search...",
}: {
  value: string;
  onChange: (s: string) => void;
  placeholder?: string;
}) {
  const { mode } = useAdminTheme();
  return (
    <View className="px-5 pt-4">
      <View
        className={
          t(
            mode,
            "bg-gray-50 border border-gray-200",
            "bg-gray-950 border border-gray-900"
          ) + " rounded-2xl px-4 py-3 flex-row items-center"
        }
      >
        <Ionicons
          name="search"
          size={18}
          color={mode === "dark" ? "#9ca3af" : "#6b7280"}
        />
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={mode === "dark" ? "#6b7280" : "#9ca3af"}
          className={t(mode, "text-gray-900", "text-white") + " flex-1 ml-3"}
        />
        {!!value && (
          <Pressable onPress={() => onChange("")} className="ml-2">
            <Ionicons
              name="close-circle"
              size={18}
              color={mode === "dark" ? "#9ca3af" : "#6b7280"}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

export function MiniBtn({
  label,
  icon,
  onPress,
  tone = "default",
}: {
  label: string;
  icon: any;
  onPress: () => void;
  tone?: "default" | "danger";
}) {
  const { mode } = useAdminTheme();
  const isDanger = tone === "danger";
  const bg = isDanger
    ? t(mode, "bg-red-50", "bg-red-950")
    : t(mode, "bg-gray-100", "bg-gray-900");
  const text = isDanger
    ? t(mode, "text-red-700", "text-red-300")
    : t(mode, "text-gray-900", "text-white");

  return (
    <Pressable
      onPress={onPress}
      className={`${bg} px-3 py-2 rounded-xl flex-row items-center`}
    >
      <Ionicons
        name={icon}
        size={16}
        color={
          isDanger
            ? mode === "dark"
              ? "#fca5a5"
              : "#b91c1c"
            : mode === "dark"
              ? "#fff"
              : "#111827"
        }
      />
      <Text className={`${text} font-bold ml-2`}>{label}</Text>
    </Pressable>
  );
}

export function FAB({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="absolute right-5 bottom-6 w-14 h-14 rounded-2xl bg-[#496c60] items-center justify-center shadow-lg"
    >
      <Ionicons name="add" size={26} color="#fff" />
    </Pressable>
  );
}

export function ModalSheetPro({
  visible,
  title,
  onClose,
  children,
  footer,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const { mode } = useAdminTheme();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable onPress={onClose} className="flex-1 bg-black/40" />
      <View
        className={
          t(mode, "bg-white", "bg-black") + " rounded-t-3xl px-5 pt-4 pb-6"
        }
        style={{
          paddingBottom: Platform.OS === "ios" ? 28 : 18,
        }}
      >
        <View className="flex-row items-center justify-between mb-3">
          <Text
            className={
              t(mode, "text-gray-900", "text-white") + " text-lg font-extrabold"
            }
          >
            {title}
          </Text>
          <Pressable
            onPress={onClose}
            className={
              t(mode, "bg-gray-100", "bg-gray-900") +
              " w-10 h-10 rounded-2xl items-center justify-center"
            }
          >
            <Ionicons
              name="close"
              size={18}
              color={mode === "dark" ? "#fff" : "#111827"}
            />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="max-h-[62vh]"
        >
          {children}
        </ScrollView>

        {!!footer && <View className="mt-4">{footer}</View>}
      </View>
    </Modal>
  );
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  keyboardType,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
  placeholder?: string;
  keyboardType?: any;
  multiline?: boolean;
}) {
  const { mode } = useAdminTheme();
  return (
    <View className="mb-3">
      <Text
        className={
          t(mode, "text-gray-700", "text-gray-300") + " font-bold mb-2"
        }
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={mode === "dark" ? "#6b7280" : "#9ca3af"}
        keyboardType={keyboardType}
        multiline={multiline}
        className={
          t(
            mode,
            "bg-gray-50 border border-gray-200 text-gray-900",
            "bg-gray-950 border border-gray-900 text-white"
          ) + " rounded-2xl px-4 py-3"
        }
      />
    </View>
  );
}

export function PrimaryBtn({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-[#496c60] rounded-2xl py-4 items-center"
    >
      <Text className="text-white font-extrabold">{label}</Text>
    </Pressable>
  );
}
