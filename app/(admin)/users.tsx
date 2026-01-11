import React, { useMemo, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";

import { useAdminStore } from "../../components/admin/AdminStore";
import { t, useAdminTheme } from "../../components/admin/theme";
import {
  CardPro,
  FAB,
  Field,
  MiniBtn,
  ModalSheetPro,
  PrimaryBtn,
  ScreenPro,
  SearchBox,
} from "../../components/admin/ui-pro";
import { EmptyState } from "../../components/admin/ux";
import type { User } from "../../types/admin";

export default function AdminUsers() {
  const { state, actions } = useAdminStore();
  const { mode } = useAdminTheme();

  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firebaseUid, setFirebaseUid] = useState("");

  const list = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return state.users;
    return state.users.filter((u) =>
      [u.email, u.username, u.firebaseUid].some((x) =>
        x.toLowerCase().includes(k)
      )
    );
  }, [q, state.users]);

  const startAdd = () => {
    setEditing(null);
    setEmail("");
    setUsername("");
    setFirebaseUid("");
    setOpen(true);
  };

  const startEdit = (u: User) => {
    setEditing(u);
    setEmail(u.email);
    setUsername(u.username);
    setFirebaseUid(u.firebaseUid);
    setOpen(true);
  };

  const save = () => {
    if (!email.trim() || !username.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập email + username");
      return;
    }
    if (editing) {
      actions.updateUser(editing._id, {
        email: email.trim(),
        username: username.trim(),
        firebaseUid: firebaseUid.trim(),
      });
    } else {
      actions.addUser({
        email: email.trim(),
        username: username.trim(),
        firebaseUid: firebaseUid.trim() || "firebase-uid",
      });
    }
    setOpen(false);
  };

  const remove = (id: string) => {
    Alert.alert("Xoá user?", "Hành động không thể hoàn tác", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: () => actions.removeUser(id),
      },
    ]);
  };

  return (
    <ScreenPro title="Users" subtitle="Quản lý người dùng">
      <SearchBox
        value={q}
        onChange={setQ}
        placeholder="Tìm theo email / username / firebaseUid"
      />

      {list.length === 0 ? (
        <EmptyState title="Chưa có user" subtitle="Nhấn + để tạo user mới." />
      ) : (
        <FlatList
          data={list}
          keyExtractor={(x) => x._id}
          contentContainerStyle={{
            padding: 20,
            paddingTop: 12,
            paddingBottom: 100,
          }}
          renderItem={({ item }) => (
            <CardPro className="mb-3">
              {/* ===== INFO ===== */}
              <View>
                <Text
                  className={
                    t(mode, "text-gray-900", "text-white") +
                    " font-extrabold text-base"
                  }
                  numberOfLines={1}
                >
                  {item.username}
                </Text>

                <Text
                  className={
                    t(mode, "text-gray-500", "text-gray-400") + " mt-1"
                  }
                  numberOfLines={1}
                >
                  {item.email}
                </Text>

                <Text
                  className={
                    t(mode, "text-gray-500", "text-gray-400") + " mt-1"
                  }
                  numberOfLines={1}
                >
                  UID: {item.firebaseUid || "-"}
                </Text>
              </View>

              {/* ===== ACTIONS (DƯỚI) ===== */}
              <View className="flex-row gap-2 mt-4 self-end">
                <MiniBtn
                  label="Sửa"
                  icon="create-outline"
                  onPress={() => startEdit(item)}
                />
                <MiniBtn
                  label="Xoá"
                  icon="trash-outline"
                  tone="danger"
                  onPress={() => remove(item._id)}
                />
              </View>
            </CardPro>
          )}
        />
      )}

      <FAB onPress={startAdd} />

      <ModalSheetPro
        visible={open}
        title={editing ? "Sửa user" : "Thêm user"}
        onClose={() => setOpen(false)}
        footer={
          <PrimaryBtn
            label={editing ? "Lưu thay đổi" : "Tạo user"}
            onPress={save}
          />
        }
      >
        <Field
          label="Email"
          value={email}
          onChange={setEmail}
          placeholder="user@gmail.com"
          keyboardType="email-address"
        />
        <Field
          label="Username"
          value={username}
          onChange={setUsername}
          placeholder="username"
        />
        <Field
          label="Firebase UID"
          value={firebaseUid}
          onChange={setFirebaseUid}
          placeholder="(optional)"
        />
      </ModalSheetPro>
    </ScreenPro>
  );
}
