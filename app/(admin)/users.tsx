import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

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

import {
  createAdminUser,
  deleteAdminUser,
  fetchAdminUsers,
  updateAdminUser,
} from "../../services/admin/adminUsersApi";

/** ================== helpers ================== */
function safeTrim(v: any) {
  const s = String(v ?? "").trim();
  return s.length ? s : "";
}

/** ================== screen ================== */
export default function AdminUsers() {
  const { mode } = useAdminTheme();

  // list state
  const [q, setQ] = useState("");
  const [items, setItems] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // modal state
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  // form
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firebaseUid, setFirebaseUid] = useState("");
  const [avatar, setAvatar] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");

  const debRef = useRef<any>(null);

  const resetForm = () => {
    setEmail("");
    setUsername("");
    setFirebaseUid("");
    setAvatar("");
    setPhoneNumber("");
    setBirthDate("");
    setGender("");
  };

  const closeModal = () => {
    setOpen(false);
    setEditing(null);
    resetForm();
  };

  const loadUsers = async (p = 1) => {
    setLoading(true);
    try {
      const res = await fetchAdminUsers({
        q,
        page: p,
        limit: 30,
        sort: "-createdAt",
      });

      setItems((prev) => (p === 1 ? res.data : [...prev, ...res.data]));
      setPage(res.meta.page);
      setTotalPages(res.meta.totalPages);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Load failed",
        text2: error?.message || "Không tải được users",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // debounce search
  useEffect(() => {
    if (debRef.current) clearTimeout(debRef.current);
    debRef.current = setTimeout(() => loadUsers(1), 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const startAdd = () => {
    setEditing(null);
    resetForm();
    setOpen(true);
  };

  const startEdit = (u: User) => {
    setEditing(u);
    setEmail(u.email || "");
    setUsername(u.username || "");
    setFirebaseUid(u.firebaseUid || "");
    setAvatar(u.avatar || "");
    setPhoneNumber(u.phoneNumber || "");
    setBirthDate(u.birthDate || "");
    setGender(u.gender || "");
    setOpen(true);
  };

  /** ================== CREATE / UPDATE ================== */
  const save = async () => {
    const isEdit = !!editing;

    const payloadCreate = {
      email: safeTrim(email).toLowerCase(),
      username: safeTrim(username),
      firebaseUid: safeTrim(firebaseUid),
      avatar: safeTrim(avatar) || undefined,
      phoneNumber: safeTrim(phoneNumber) || undefined,
      birthDate: safeTrim(birthDate) || undefined,
      gender: safeTrim(gender) || undefined,
    };

    if (!payloadCreate.username) {
      Toast.show({
        type: "error",
        text1: "Thiếu thông tin",
        text2: "Username là bắt buộc",
      });
      return;
    }

    if (!isEdit && (!payloadCreate.email || !payloadCreate.firebaseUid)) {
      Toast.show({
        type: "error",
        text1: "Thiếu thông tin",
        text2: "Email và Firebase UID là bắt buộc khi tạo user",
      });
      return;
    }

    try {
      if (isEdit) {
        // ✅ update: không gửi email + firebaseUid
        await updateAdminUser(editing!._id, {
          username: payloadCreate.username,
          avatar: payloadCreate.avatar,
          phoneNumber: payloadCreate.phoneNumber,
          birthDate: payloadCreate.birthDate,
          gender: payloadCreate.gender,
        });

        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Đã cập nhật user",
        });
      } else {
        await createAdminUser(payloadCreate);

        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Đã tạo user mới",
        });
      }

      closeModal();
      loadUsers(1);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: isEdit ? "Update failed" : "Create failed",
        text2: error?.message || "Không lưu được user",
      });
    }
  };

  /** ================== DELETE ================== */
  const remove = (id: string) => {
    Alert.alert("Xoá user?", "Bạn có chắc chắn muốn xoá user này?", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteAdminUser(id);

            Toast.show({
              type: "success",
              text1: "Success",
              text2: "Đã xoá user",
            });

            loadUsers(1);
          } catch (error: any) {
            Toast.show({
              type: "error",
              text1: "Delete failed",
              text2: error?.message || "Không xoá được user",
            });
          }
        },
      },
    ]);
  };

  const isEdit = !!editing;

  /** ================== item render ================== */
  const renderUser = ({ item }: { item: User }) => {
    const hasAvatar = !!item.avatar;

    return (
      <CardPro className="mb-3">
        <View className="flex-row">
          {/* avatar */}
          <View
            className={
              t(mode, "bg-gray-100", "bg-gray-900") +
              " w-12 h-12 rounded-2xl overflow-hidden mr-3 items-center justify-center"
            }
          >
            {hasAvatar ? (
              <Image
                source={{ uri: item.avatar! }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            ) : (
              <Text className={t(mode, "text-gray-500", "text-gray-400")}>
                🙂
              </Text>
            )}
          </View>

          <View className="flex-1">
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
              className={t(mode, "text-gray-500", "text-gray-400") + " mt-1"}
              numberOfLines={1}
            >
              {item.email}
            </Text>

            <Text
              className={t(mode, "text-gray-500", "text-gray-400") + " mt-1"}
              numberOfLines={1}
            >
              {item.phoneNumber ? `📞 ${item.phoneNumber}` : "📞 -"} {"  "}•
              {"  "}
              {item.gender ? `⚧ ${item.gender}` : "⚧ -"} {"  "}•{"  "}
              {item.birthDate ? `🎂 ${item.birthDate}` : "🎂 -"}
            </Text>

            <Text
              className={t(mode, "text-gray-500", "text-gray-400") + " mt-1"}
              numberOfLines={1}
            >
              UID: {item.firebaseUid || "-"}
            </Text>
          </View>
        </View>

        {/* actions */}
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
    );
  };

  /** ================== UI ================== */
  return (
    <ScreenPro title="Users" subtitle="Quản lý người dùng">
      <SearchBox
        value={q}
        onChange={setQ}
        placeholder="Tìm theo email / username / firebaseUid"
      />

      {loading && items.length === 0 ? (
        <View className="py-8 items-center">
          <ActivityIndicator />
        </View>
      ) : items.length === 0 ? (
        <EmptyState title="Chưa có user" subtitle="Nhấn + để tạo user mới." />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(x) => x._id}
          renderItem={renderUser}
          onEndReached={() => {
            if (!loading && page < totalPages) loadUsers(page + 1);
          }}
          onEndReachedThreshold={0.4}
          contentContainerStyle={{
            padding: 20,
            paddingTop: 12,
            paddingBottom: 110,
          }}
        />
      )}

      <FAB onPress={startAdd} />

      <ModalSheetPro
        visible={open}
        title={editing ? "Sửa user" : "Thêm user"}
        onClose={closeModal}
        footer={
          <PrimaryBtn
            label={editing ? "Lưu thay đổi" : "Tạo user"}
            onPress={save}
          />
        }
      >
        {/* Email: lock khi edit */}
        <View
          pointerEvents={isEdit ? "none" : "auto"}
          style={{ opacity: isEdit ? 0.6 : 1 }}
        >
          <Field
            label="Email *"
            value={email}
            onChange={setEmail}
            placeholder="user@gmail.com"
            keyboardType="email-address"
          />
        </View>

        <Field
          label="Username *"
          value={username}
          onChange={setUsername}
          placeholder="username"
        />

        {/* Firebase UID: lock khi edit */}
        <View
          pointerEvents={isEdit ? "none" : "auto"}
          style={{ opacity: isEdit ? 0.6 : 1 }}
        >
          <Field
            label="Firebase UID *"
            value={firebaseUid}
            onChange={setFirebaseUid}
            placeholder="firebase-uid"
          />
        </View>

        <Field
          label="Avatar URL"
          value={avatar}
          onChange={setAvatar}
          placeholder="https://..."
        />
        <Field
          label="Phone number"
          value={phoneNumber}
          onChange={setPhoneNumber}
          placeholder="03xxxxxxxxx"
          keyboardType="phone-pad"
        />
        <Field
          label="Birth date (YYYY-MM-DD)"
          value={birthDate}
          onChange={setBirthDate}
          placeholder="2004-02-09"
        />
        <Field
          label="Gender"
          value={gender}
          onChange={setGender}
          placeholder="male / female / other"
        />
      </ModalSheetPro>
    </ScreenPro>
  );
}
