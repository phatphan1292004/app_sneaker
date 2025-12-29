import api from "@/services/api";

export const notificationService = {
  getAll(firebaseUid: string) {
    return api.get(`/notifications/${firebaseUid}`);
  },

  unreadCount(firebaseUid: string) {
    return api.get(`/notifications/${firebaseUid}/unread-count`);
  },

  markAsRead(id: string) {
    return api.put(`/notifications/${id}/read`);
  },

  remove(id: string) {
    return api.delete(`/notifications/${id}`);
  },
};
