import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import { auth } from "../config/firebase";

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Đăng ký người dùng mới
export const registerUser = async (data: RegisterData): Promise<User> => {
  try {
    console.log("Creating user with email:", data.email);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    const user = userCredential.user;
    console.log("User created:", user.uid);

    // Cập nhật display name
    console.log("Updating profile...");
    await updateProfile(user, {
      displayName: data.username,
    });
    console.log("Profile updated");
    return user;
  } catch (error: any) {
    console.error("Registration error details:", error);
    throw new Error(error.message);
  }
};

// Đăng nhập
export const loginUser = async (data: LoginData): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Đăng xuất
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Lấy user hiện tại
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
