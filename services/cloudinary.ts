export async function uploadToCloudinary(localUri: string) {
  // LẤY TỪ CLOUDINARY DASHBOARD -> API Keys (ảnh bạn gửi)
  const CLOUD_NAME = "dwwnddydv";

  // LẤY TỪ Upload Presets (ảnh bạn gửi)
  const UPLOAD_PRESET = "app-sneaker";

  const form = new FormData();

  form.append("file", {
    uri: localUri,
    type: "image/jpeg",
    name: "avatar.jpg",
  } as any);

  form.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: form,
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || "Upload Cloudinary failed");
  }

  return data.secure_url as string;
}
