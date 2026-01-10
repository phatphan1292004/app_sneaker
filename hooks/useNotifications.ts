import { useAuth } from "@/contexts/AuthContext";
import { notificationService } from "@/services/notificationService";
import { useEffect, useState } from "react";

export function useNotifications() {
  const { user } = useAuth();
  const firebaseUid = (user as any)?.uid;

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!firebaseUid) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await notificationService.getAll(firebaseUid);
      setNotifications(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
  };

  const remove = async (id: string) => {
    await notificationService.remove(id);
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  useEffect(() => {
    fetchNotifications();
  }, [firebaseUid]);

  return {
    notifications,
    loading,
    refresh: fetchNotifications,
    markAsRead,
    remove,
  };
}
