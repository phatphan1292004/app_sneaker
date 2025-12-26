import api from "./api";

export interface Profile {
  _id: string;
  firebaseUid: string;
  username: string;
  email: string;
  avatar?: string;
  phoneNumber?: string;
  birthDate?: string;
  gender?: string;
}

export const profileService = {
  getByFirebaseUid: async (firebaseUid: string) => {
    const res = await api.get(`/profile/by-firebase/${firebaseUid}`);
    return res.data;
  },

  updateProfile: async (
    id: string,
    payload: Partial<
      Pick<Profile, "username" | "phoneNumber" | "birthDate" | "gender">
    >
  ) => {
    const res = await api.put(`/profile/${id}`, payload);
    return res.data;
  },

  updateAvatar: async (id: string, avatar: string) => {
    const res = await api.put(`/profile/${id}/avatar`, { avatar });
    return res.data;
  },
};
