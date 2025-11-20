export async function upload(file) {
  const CLOUD_NAME = "dayy8te6n"; // your cloud name
  const UPLOAD_PRESET = "unsigned_preset"; // your unsigned preset name

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

    // Return more metadata so we can store better info in messages
    return {
      url: data.secure_url,
      publicId: data.public_id,
      format: data.format,
      bytes: data.bytes,
      width: data.width,
      height: data.height,
      originalFilename: data.original_filename,
      // Keep raw in case you need anything else later
      raw: data,
    };
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    throw err;
  }
}