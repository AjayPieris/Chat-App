// src/lib/storage.js
export const openUploadWidget = (callback) => {
  if (!window.cloudinary) {
    alert("Cloudinary script not loaded");
    return;
  }

  const widget = window.cloudinary.createUploadWidget(
    {
      cloudName: "dayy8te6n", // your Cloudinary cloud name
      uploadPreset: "unsigned_preset", 
      cloudapiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
      sources: ["local", "url", "camera"],
      multiple: false,
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        callback(result.info.secure_url);
      }
    }
  );

  widget.open();
};
