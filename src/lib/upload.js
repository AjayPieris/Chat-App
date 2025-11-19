export async function upload(file) {
  const CLOUD_NAME = "dayy8te6n";         // your cloud name
  const UPLOAD_PRESET = "unsigned_preset";       // your unsigned preset name

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const res = await fetch(url, { method: "POST", body: formData });
    const data = await res.json();

    console.log("Cloudinary Response:", data);

    if (!res.ok) {
      throw new Error(data.error?.message || "Upload failed");
    }

    return data.secure_url;
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    throw err;
  }
}
