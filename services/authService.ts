import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { userService } from "./userService";

export interface RegisterData {
  name: string;
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
    // 1. Tạo user trong Firebase
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    const user = userCredential.user;

    // 2. Cập nhật profile trong Firebase
    await updateProfile(user, {
      displayName: data.name,
    });

    // 3. Sync user data xuống MongoDB
    try {
      await userService.createUser({
        firebaseUid: user.uid,
        username: data.name,
        email: data.email,
        avatar: user.photoURL || undefined,
      });
      console.log("User synced to MongoDB successfully");
    } catch (syncError) {
      console.error("Failed to sync user to MongoDB:", syncError);
    }

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

// Đăng nhập bằng Google
export const loginWithGoogle = async (idToken: string): Promise<User> => {
  try {
    const credential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(auth, credential);
    const user = userCredential.user;

    // Sync user data xuống MongoDB
    try {
      await userService.createUser({
        firebaseUid: user.uid,
        username: user.displayName || "Google User",
        email: user.email || "",
        avatar: user.photoURL || undefined,
      });
      console.log("Google user synced to MongoDB successfully");
    } catch (syncError) {
      console.error("Failed to sync Google user to MongoDB:", syncError);
    }

    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
